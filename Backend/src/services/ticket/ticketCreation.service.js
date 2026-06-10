const prisma = require("../../config/prisma");
const pointsCalculator = require("../resolution/pointsCalculator.service");
const rarityBonus = require("../resolution/rarityBonus.service");
const firstBettorBonus = require("../resolution/firstBettorBonus.service");
const notificationService = require("../notification.service");

const MAX_MATCHES = 3;
const MAX_EVENTS = 5;

class TicketCreationService {
    async createTicket(userId, roomId, selections) {
        // selections: [{ market_id }, ...]

        if (!selections || selections.length === 0) {
            throw new Error("Debes seleccionar al menos un evento");
        }

        if (selections.length > MAX_EVENTS) {
            throw new Error(`Máximo ${MAX_EVENTS} eventos por ticket`);
        }

        // Verificar membresía
        const member = await prisma.room_members.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId)
            }
        });

        if (!member) throw new Error("No perteneces a esta sala");

        // Verificar ticket abierto existente
        const existing = await prisma.tickets.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId),
                ticket_status: "OPEN"
            }
        });

        if (existing) throw new Error("Ya tienes un ticket abierto en esta sala");

        // Cargar mercados con su partido
        const marketIds = selections.map(s => BigInt(s.market_id));

        const markets = await prisma.markets.findMany({
            where: {
                market_id: { in: marketIds },
                is_active: true
            },
            include: {
                matches: true,
                market_types: true,
                players: true
            }
        });

        if (markets.length !== selections.length) {
            throw new Error("Uno o más mercados no existen o están inactivos");
        }

        // Validar máx 3 partidos distintos
        const uniqueMatchIds = new Set(markets.map(m => m.match_id.toString()));

        if (uniqueMatchIds.size > MAX_MATCHES) {
            throw new Error(`Máximo ${MAX_MATCHES} partidos distintos por ticket`);
        }

        // Validar que los partidos estén seleccionados para la sala
        const roomSelections = await prisma.room_match_selections.findMany({
            where: {
                room_id: BigInt(roomId),
                match_id: { in: markets.map(m => m.match_id) }
            }
        });

        const selectedMatchIds = new Set(roomSelections.map(s => s.match_id.toString()));

        for (const market of markets) {
            if (!selectedMatchIds.has(market.match_id.toString())) {
                throw new Error(`El partido ${market.match_id} no está habilitado en esta sala`);
            }
        }

        // Validar que los partidos estén SCHEDULED
        for (const market of markets) {
            if (market.matches.status !== "SCHEDULED") {
                throw new Error(`El partido ${market.match_id} ya no está disponible para apuestas`);
            }
        }

        // Crear ticket y eventos en transacción
        const ticket = await prisma.$transaction(async (tx) => {
            const newTicket = await tx.tickets.create({
                data: {
                    room_id: BigInt(roomId),
                    user_id: BigInt(userId),
                    ticket_status: "OPEN"
                }
            });

            for (const market of markets) {
                const basePoints = pointsCalculator.calculateBasePoints(market.probability);
                const rarityBonusPoints = await rarityBonus.calculateBonus(market.market_id);
                const firstBettorBonusPoints = await firstBettorBonus.calculateBonus(market.market_id);
                const finalPoints = basePoints + rarityBonusPoints + firstBettorBonusPoints;

                await tx.ticket_events.create({
                    data: {
                        ticket_id: newTicket.ticket_id,
                        market_id: market.market_id,
                        frozen_probability: market.probability,
                        base_points: basePoints,
                        rarity_bonus_points: rarityBonusPoints,
                        first_bettor_bonus_points: firstBettorBonusPoints,
                        final_points: finalPoints,
                        event_result: "PENDING"
                    }
                });

                // Notificación en sala
                const playerName = market.players
                    ? `${market.players.first_name} ${market.players.last_name}`
                    : null;

                const user = await tx.users.findUnique({
                    where: { user_id: BigInt(userId) },
                    select: { username: true }
                });

                const eventDesc = playerName
                    ? `${market.market_types.code} - ${playerName}`
                    : market.market_types.code;

                await tx.notifications.create({
                    data: {
                        room_id: BigInt(roomId),
                        user_id: BigInt(userId),
                        notification_type: "BET_PLACED",
                        title: "Nueva apuesta",
                        message: `${user.username} apostó a: ${eventDesc}`
                    }
                });
            }

            return newTicket;
        });

        return prisma.tickets.findUnique({
            where: { ticket_id: ticket.ticket_id },
            include: { ticket_events: true }
        });
    }
}

module.exports = new TicketCreationService();