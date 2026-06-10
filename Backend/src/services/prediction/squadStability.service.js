const prisma = require("../../config/prisma");

class SquadStabilityService {
    async calculate(teamId) {
        const players =
            await prisma.players.findMany({
                where: {
                    team_id: BigInt(teamId),
                    is_active: true
                },
                select: {
                    player_id: true
                }
            });

        if (!players.length) {
            return 50;
        }

        const playerIds =
            players.map(
                player =>
                    player.player_id
            );

        const [
            activeInjuries,
            ratings
        ] = await Promise.all([
            prisma.injuries.count({
                where: {
                    player_id: {
                        in: playerIds
                    },
                    is_active: true
                }
            }),

            prisma.player_ratings.findMany({
                where: {
                    player_id: {
                        in: playerIds
                    }
                },
                orderBy: {
                    rating_date: "desc"
                }
            })
        ]);

        const latestRatings =
            new Map();

        for (const rating of ratings) {
            const playerId =
                rating.player_id.toString();

            if (
                !latestRatings.has(
                    playerId
                )
            ) {
                latestRatings.set(
                    playerId,
                    Number(
                        rating.final_rating
                    )
                );
            }
        }

        const averageRating =
            latestRatings.size > 0
                ? [...latestRatings.values()]
                      .reduce(
                          (
                              sum,
                              value
                          ) =>
                              sum + value,
                          0
                      ) /
                  latestRatings.size
                : 50;

        const healthyPlayers =
            Math.max(
                0,
                players.length -
                    activeInjuries
            );

        const availability =
            (healthyPlayers /
                players.length) *
            100;

        const stability =
            availability * 0.9 +
            averageRating * 0.1;

        return Number(
            Math.max(
                0,
                Math.min(
                    100,
                    stability
                )
            ).toFixed(2)
        );
    }
}

module.exports =
    new SquadStabilityService();