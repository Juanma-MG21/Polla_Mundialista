const prisma = require("../config/prisma");

class RankingService {
    async getRoomRanking(roomId) {
        const members = await prisma.room_members.findMany({
            where: { room_id: BigInt(roomId) },
            select: { user_id: true }
        });

        if (members.length === 0) return [];

        const userIds = members.map(m => m.user_id);

        const scores = await prisma.user_scores.findMany({
            where: { user_id: { in: userIds } },
            include: {
                users: {
                    select: {
                        user_id: true,
                        username: true,
                        first_name: true,
                        last_name: true
                    }
                }
            },
            orderBy: { total_points: "desc" }
        });

        return scores.map((score, index) => ({
            position: index + 1,
            user_id: String(score.user_id),
            username: score.users.username,
            first_name: score.users.first_name,
            last_name: score.users.last_name,
            total_points: score.total_points,
            total_events_played: score.total_events_played,
            total_events_won: score.total_events_won,
            total_events_lost: score.total_events_lost
        }));
    }

    async getUserStatsInRoom(userId, roomId) {
        const member = await prisma.room_members.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId)
            }
        });

        if (!member) throw new Error("El usuario no pertenece a esta sala");

        const score = await prisma.user_scores.findUnique({
            where: { user_id: BigInt(userId) },
            include: {
                users: {
                    select: { username: true, first_name: true, last_name: true }
                }
            }
        });

        const tickets = await prisma.tickets.findMany({
            where: {
                user_id: BigInt(userId),
                room_id: BigInt(roomId)
            },
            include: { ticket_events: true }
        });

        const roomPoints = tickets.reduce((total, ticket) => {
            return total + ticket.ticket_events
                .filter(e => e.event_result === "WON")
                .reduce((sum, e) => sum + e.final_points, 0);
        }, 0);

        return {
            user_id: String(userId),
            username: score?.users.username,
            total_points_global: score?.total_points ?? 0,
            total_points_room: roomPoints,
            total_events_played: score?.total_events_played ?? 0,
            total_events_won: score?.total_events_won ?? 0,
            total_events_lost: score?.total_events_lost ?? 0,
            tickets_in_room: tickets.length
        };
    }
}

module.exports = new RankingService();