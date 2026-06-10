const prisma = require("../../config/prisma");

class TicketLockService {
    // Cierra todos los tickets OPEN de partidos que ya no están SCHEDULED
    async lockExpiredTickets() {
        const nonScheduledMatches = await prisma.matches.findMany({
            where: {
                status: { notIn: ["SCHEDULED"] }
            },
            select: { match_id: true }
        });

        if (nonScheduledMatches.length === 0) return { locked: 0 };

        const matchIds = nonScheduledMatches.map(m => m.match_id);

        // Tickets OPEN que tienen eventos en esos partidos
        const ticketsToLock = await prisma.tickets.findMany({
            where: {
                ticket_status: "OPEN",
                ticket_events: {
                    some: {
                        markets: {
                            match_id: { in: matchIds }
                        }
                    }
                }
            },
            select: { ticket_id: true }
        });

        if (ticketsToLock.length === 0) return { locked: 0 };

        const ticketIds = ticketsToLock.map(t => t.ticket_id);

        await prisma.tickets.updateMany({
            where: { ticket_id: { in: ticketIds } },
            data: {
                ticket_status: "CLOSED",
                closed_at: new Date()
            }
        });

        return { locked: ticketIds.length };
    }

    async lockTicket(ticketId) {
        const ticket = await prisma.tickets.findUnique({
            where: { ticket_id: BigInt(ticketId) }
        });

        if (!ticket) throw new Error("Ticket no encontrado");
        if (ticket.ticket_status !== "OPEN") throw new Error("El ticket ya está cerrado");

        return prisma.tickets.update({
            where: { ticket_id: BigInt(ticketId) },
            data: {
                ticket_status: "CLOSED",
                closed_at: new Date()
            }
        });
    }
}

module.exports = new TicketLockService();