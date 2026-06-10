const prisma = require("../../config/prisma");
const ticketResolver = require("../resolution/ticketResolver.service");

async function resolveTickets() {
    const tickets = await prisma.tickets.findMany({
        where: { ticket_status: "CLOSED" },
        select: { ticket_id: true }
    });

    const results = [];

    for (const ticket of tickets) {
        try {
            const result = await ticketResolver.resolveTicket(ticket.ticket_id);
            results.push({ ticket_id: String(ticket.ticket_id), status: result.ticket.ticket_status, earned: result.earnedPoints });
        } catch (err) {
            results.push({ ticket_id: String(ticket.ticket_id), error: err.message });
        }
    }

    return results;
}

module.exports = resolveTickets;