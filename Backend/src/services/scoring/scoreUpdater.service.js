const prisma = require("../../config/prisma");

class ScoreUpdaterService {
    async updateUserScore(userId, earnedPoints, ticketEvents) {
        const wonEvents = ticketEvents.filter(e => e.event_result === "WON").length;
        const lostEvents = ticketEvents.filter(e => e.event_result === "LOST").length;
        const playedEvents = wonEvents + lostEvents;

        return prisma.user_scores.upsert({
            where: { user_id: BigInt(userId) },
            create: {
                user_id: BigInt(userId),
                total_points: Number(earnedPoints),
                total_events_played: playedEvents,
                total_events_won: wonEvents,
                total_events_lost: lostEvents
            },
            update: {
                total_points: { increment: Number(earnedPoints) },
                total_events_played: { increment: playedEvents },
                total_events_won: { increment: wonEvents },
                total_events_lost: { increment: lostEvents },
                updated_at: new Date()
            }
        });
    }
}

module.exports = new ScoreUpdaterService();