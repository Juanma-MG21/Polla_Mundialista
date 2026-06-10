const prisma = require("../../config/prisma");

const MAX_MATCHES = 3;
const MAX_EVENTS = 5;

class TicketValidationService {
    async validate(userId, roomId, selections) {
        const errors = [];

        if (!selections || selections.length === 0) {
            errors.push("Debes seleccionar al menos un evento");
            return { valid: false, errors };
        }

        if (selections.length > MAX_EVENTS) {
            errors.push(`Máximo ${MAX_EVENTS} eventos por ticket`);
        }

        const member = await prisma.room_members.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId)
            }
        });

        if (!member) errors.push("No perteneces a esta sala");

        const existing = await prisma.tickets.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId),
                ticket_status: "OPEN"
            }
        });

        if (existing) errors.push("Ya tienes un ticket abierto en esta sala");

        const marketIds = selections.map(s => BigInt(s.market_id));

        const markets = await prisma.markets.findMany({
            where: {
                market_id: { in: marketIds },
                is_active: true
            },
            include: { matches: true }
        });

        if (markets.length !== selections.length) {
            errors.push("Uno o más mercados no existen o están inactivos");
        } else {
            const uniqueMatchIds = new Set(markets.map(m => m.match_id.toString()));

            if (uniqueMatchIds.size > MAX_MATCHES) {
                errors.push(`Máximo ${MAX_MATCHES} partidos distintos por ticket`);
            }

            for (const market of markets) {
                if (market.matches.status !== "SCHEDULED") {
                    errors.push(`Partido ${market.match_id} no disponible para apuestas`);
                }
            }
        }

        return { valid: errors.length === 0, errors };
    }
}

module.exports = new TicketValidationService();