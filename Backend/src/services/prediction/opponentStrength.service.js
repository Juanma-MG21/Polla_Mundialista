const prisma = require("../../config/prisma");

class OpponentStrengthService {
    async calculate(teamId) {
        const matches = await prisma.matches.findMany({
            where: {
                status: "FINISHED",
                OR: [
                    {
                        home_team_id: Number(teamId)
                    },
                    {
                        away_team_id: Number(teamId)
                    }
                ]
            },
            orderBy: {
                match_datetime: "desc"
            },
            take: 10
        });

        if (!matches.length) {
            return 50;
        }

        const opponentIds = matches.map((match) => {
            return match.home_team_id === Number(teamId)
                ? match.away_team_id
                : match.home_team_id;
        });

        const ratings =
            await prisma.team_ratings.findMany({
                where: {
                    team_id: {
                        in: opponentIds
                    }
                },
                orderBy: {
                    rating_date: "desc"
                }
            });

        if (!ratings.length) {
            return 50;
        }

        const latestRatings = new Map();

        for (const rating of ratings) {
            if (!latestRatings.has(rating.team_id)) {
                latestRatings.set(
                    rating.team_id,
                    Number(rating.final_rating)
                );
            }
        }

        const values = [
            ...latestRatings.values()
        ];

        const average =
            values.reduce(
                (sum, value) => sum + value,
                0
            ) / values.length;

        return Number(average.toFixed(2));
    }
}

module.exports = new OpponentStrengthService();