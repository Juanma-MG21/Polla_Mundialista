const prisma = require("../../config/prisma");

class OpponentStrengthService {
    async calculate(
        homeTeamId,
        awayTeamId
    ) {
        const [
            homeRating,
            awayRating
        ] = await Promise.all([
            prisma.team_ratings.findFirst({
                where: {
                    team_id:
                        BigInt(
                            homeTeamId
                        )
                },
                orderBy: {
                    rating_date:
                        "desc"
                }
            }),

            prisma.team_ratings.findFirst({
                where: {
                    team_id:
                        BigInt(
                            awayTeamId
                        )
                },
                orderBy: {
                    rating_date:
                        "desc"
                }
            })
        ]);

        const homeValue =
            homeRating
                ? Number(
                      homeRating.final_rating
                  )
                : 50;

        const awayValue =
            awayRating
                ? Number(
                      awayRating.final_rating
                  )
                : 50;

        const total =
            homeValue + awayValue;

        if (total === 0) {
            return {
                home: 50,
                away: 50
            };
        }

        return {
            home: Number(
                (
                    (homeValue /
                        total) *
                    100
                ).toFixed(2)
            ),

            away: Number(
                (
                    (awayValue /
                        total) *
                    100
                ).toFixed(2)
            )
        };
    }
}

module.exports =
    new OpponentStrengthService();