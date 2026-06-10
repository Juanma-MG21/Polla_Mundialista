const prisma = require("../../config/prisma");
const scoreUpdater = require("./scoreUpdater.service");

class TicketResolverService {
    async resolveTicket(ticketId) {
        const ticket = await prisma.tickets.findUnique({
            where: { ticket_id: BigInt(ticketId) }
        });

        if (!ticket) throw new Error("Ticket not found");

        if (ticket.ticket_status === "RESOLVED" || ticket.ticket_status === "VOID") {
            return ticket;
        }

        const ticketEvents = await prisma.ticket_events.findMany({
            where: { ticket_id: BigInt(ticketId) },
            include: {
                markets: {
                    include: { market_results: true }
                }
            }
        });

        if (ticketEvents.length === 0) throw new Error("Ticket has no events");

        for (const event of ticketEvents) {
            const marketResult = event.markets?.market_results?.[0];

            if (!marketResult) {
                throw new Error(`Market ${event.market_id} not resolved`);
            }

            await prisma.ticket_events.update({
                where: { ticket_event_id: event.ticket_event_id },
                data: { event_result: marketResult.result_status }
            });
        }

        const updatedEvents = await prisma.ticket_events.findMany({
            where: { ticket_id: BigInt(ticketId) }
        });

        const totalEvents = updatedEvents.length;
        const wonEvents = updatedEvents.filter(e => e.event_result === "WON");
        const lostEvents = updatedEvents.filter(e => e.event_result === "LOST");
        const voidEvents = updatedEvents.filter(e => e.event_result === "VOID");

        let ticketStatus = "RESOLVED";
        let earnedPoints = 0;

        if (voidEvents.length === totalEvents) {
            ticketStatus = "VOID";
        } else if (lostEvents.length > 0) {
            ticketStatus = "RESOLVED";
            earnedPoints = 0;
        } else {
            ticketStatus = "RESOLVED";
            earnedPoints = wonEvents.reduce((total, e) => total + e.final_points, 0);
        }

        const updatedTicket = await prisma.tickets.update({
            where: { ticket_id: BigInt(ticketId) },
            data: { ticket_status: ticketStatus, closed_at: new Date() }
        });

        if (ticketStatus === "RESOLVED") {
            await scoreUpdater.updateUserScore(ticket.user_id, earnedPoints, updatedEvents);
        }

        return {
            ticket: updatedTicket,
            earnedPoints,
            totalEvents,
            wonEvents: wonEvents.length,
            lostEvents: lostEvents.length,
            voidEvents: voidEvents.length
        };
    }
}

module.exports = new TicketResolverService();