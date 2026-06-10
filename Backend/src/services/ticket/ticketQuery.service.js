const prisma = require("../../config/prisma");

class TicketQueryService {
    async getByRoom(roomId) {
        return prisma.tickets.findMany({
            where: { room_id: BigInt(roomId) },
            include: {
                users: { select: { username: true, first_name: true, last_name: true } },
                ticket_events: {
                    include: {
                        markets: {
                            include: { market_types: true, players: true }
                        }
                    }
                }
            },
            orderBy: { created_at: "desc" }
        });
    }

    async getByUser(userId) {
        return prisma.tickets.findMany({
            where: { user_id: BigInt(userId) },
            include: {
                rooms: { select: { room_name: true } },
                ticket_events: {
                    include: {
                        markets: {
                            include: { market_types: true, players: true }
                        }
                    }
                }
            },
            orderBy: { created_at: "desc" }
        });
    }

    async getById(ticketId) {
        return prisma.tickets.findUnique({
            where: { ticket_id: BigInt(ticketId) },
            include: {
                users: { select: { username: true, first_name: true, last_name: true } },
                rooms: { select: { room_name: true } },
                ticket_events: {
                    include: {
                        markets: {
                            include: {
                                market_types: true,
                                players: true,
                                matches: true,
                                market_results: true
                            }
                        }
                    }
                }
            }
        });
    }

    async getOpenByUserInRoom(userId, roomId) {
        return prisma.tickets.findFirst({
            where: {
                user_id: BigInt(userId),
                room_id: BigInt(roomId),
                ticket_status: "OPEN"
            },
            include: { ticket_events: true }
        });
    }
}

module.exports = new TicketQueryService();