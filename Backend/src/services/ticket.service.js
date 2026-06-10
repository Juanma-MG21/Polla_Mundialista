const prisma = require("../config/prisma");

class TicketService {
    async create(roomId, userId) {
        const room = await prisma.rooms.findUnique({
            where: { room_id: BigInt(roomId) }
        });

        if (!room) throw new Error("Sala no encontrada");

        const member = await prisma.room_members.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId)
            }
        });

        if (!member) throw new Error("No perteneces a esta sala");

        const existing = await prisma.tickets.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId),
                ticket_status: "OPEN"
            }
        });

        if (existing) throw new Error("Ya tienes un ticket abierto en esta sala");

        return prisma.tickets.create({
            data: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId),
                ticket_status: "OPEN"
            },
            include: { ticket_events: true }
        });
    }

    async getByRoom(roomId) {
        return prisma.tickets.findMany({
            where: { room_id: BigInt(roomId) },
            include: { ticket_events: true, users: true },
            orderBy: { created_at: "desc" }
        });
    }

    async getByUser(userId) {
        return prisma.tickets.findMany({
            where: { user_id: BigInt(userId) },
            include: { ticket_events: true, rooms: true },
            orderBy: { created_at: "desc" }
        });
    }

    async getById(ticketId) {
        return prisma.tickets.findUnique({
            where: { ticket_id: BigInt(ticketId) },
            include: {
                ticket_events: {
                    include: { markets: true }
                },
                users: true,
                rooms: true
            }
        });
    }

    async close(ticketId) {
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

module.exports = new TicketService();