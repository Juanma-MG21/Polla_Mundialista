const prisma = require("../../config/prisma");

class HistoricalService {
    async calculate(teamId) {
        const statistics =
            await prisma.team_statistics.findMany({
                where: {
                    team_id: BigInt(teamId)
                },
                orderBy: {
                    snapshot_date: "desc"
                },
                take: 10
            });

        if (
            !statistics ||
            statistics.length === 0
        ) {
            return 50;
        }

        let totalPoints = 0;
        let totalPossiblePoints = 0;

        let totalGoalsFor = 0;
        let totalGoalsAgainst = 0;

        let totalMatches = 0;

        for (const stat of statistics) {
            const wins =
                Number(stat.wins);

            const draws =
                Number(stat.draws);

            const matchesPlayed =
                Number(
                    stat.matches_played
                );

            totalPoints +=
                wins * 3 +
                draws;

            totalPossiblePoints +=
                matchesPlayed * 3;

            totalGoalsFor +=
                Number(
                    stat.goals_for
                );

            totalGoalsAgainst +=
                Number(
                    stat.goals_against
                );

            totalMatches +=
                matchesPlayed;
        }

        const pointsRatio =
            totalPossiblePoints > 0
                ? totalPoints /
                  totalPossiblePoints
                : 0.5;

        const avgGoalDifference =
            totalMatches > 0
                ? (
                      totalGoalsFor -
                      totalGoalsAgainst
                  ) / totalMatches
                : 0;

        const goalModifier =
            Math.max(
                -10,
                Math.min(
                    10,
                    avgGoalDifference * 5
                )
            );

        const score =
            pointsRatio * 80 +
            20 +
            goalModifier;

        return Number(
            Math.max(
                0,
                Math.min(
                    100,
                    score
                )
            ).toFixed(2)
        );
    }
}

module.exports =
    new HistoricalService();