const prisma = require("../../config/prisma");

class SquadStabilityService {
    async calculate(teamId) {
        const players = await prisma.players.findMany({
            where: {
                team_id: Number(teamId)
            },
            select: {
                player_id: true
            }
        });

        if (!players.length) {
            return 50;
        }

        const playerIds = players.map(
            player => player.player_id
        );

        const activeInjuries =
            await prisma.injuries.count({
                where: {
                    player_id: {
                        in: playerIds
                    },
                    is_active: true
                }
            });

        const ratings =
            await prisma.player_ratings.findMany({
                where: {
                    player_id: {
                        in: playerIds
                    }
                },
                orderBy: {
                    rating_date: "desc"
                }
            });

        const latestRatings = new Map();

        for (const rating of ratings) {
            if (!latestRatings.has(rating.player_id)) {
                latestRatings.set(
                    rating.player_id,
                    Number(rating.final_rating)
                );
            }
        }

        const averageRating =
            latestRatings.size
                ? [...latestRatings.values()]
                      .reduce(
                          (sum, value) =>
                              sum + value,
                          0
                      ) /
                  latestRatings.size
                : 50;

        const injuryImpact =
            (activeInjuries /
                players.length) *
            100;

        const stability =
            averageRating * 0.7 +
            (100 - injuryImpact) * 0.3;

        return Number(
            Math.max(
                0,
                Math.min(100, stability)
            ).toFixed(2)
        );
    }
}

module.exports =
    new SquadStabilityService();