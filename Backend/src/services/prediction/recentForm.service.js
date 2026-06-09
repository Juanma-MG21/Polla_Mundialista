const prisma = require("../../config/prisma");

class RecentFormService {
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
            take: 5
        });

        if (!matches.length) {
            return 50;
        }

        let points = 0;
        let goalsFor = 0;
        let goalsAgainst = 0;

        for (const match of matches) {
            const isHome =
                match.home_team_id === Number(teamId);

            const scored = isHome
                ? match.home_score
                : match.away_score;

            const conceded = isHome
                ? match.away_score
                : match.home_score;

            goalsFor += scored || 0;
            goalsAgainst += conceded || 0;

            if (scored > conceded) points += 3;
            else if (scored === conceded) points += 1;
        }

        const maxPoints = matches.length * 3;

        const pointsRate =
            (points / maxPoints) * 100;

        const goalBalance =
            goalsFor - goalsAgainst;

        const goalFactor =
            Math.max(
                0,
                Math.min(
                    100,
                    50 + goalBalance * 5
                )
            );

        const finalScore =
            pointsRate * 0.70 +
            goalFactor * 0.30;

        return Number(finalScore.toFixed(2));
    }
}

module.exports = new RecentFormService();