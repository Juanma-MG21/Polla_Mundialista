const prisma = require("../../config/prisma");

class RecentFormService {
    async calculate(teamId) {
        const statistics =
            await prisma.team_statistics.findMany({
                where: {
                    team_id: BigInt(teamId)
                },
                orderBy: {
                    snapshot_date: "desc"
                },
                take: 5
            });

        if (
            !statistics ||
            statistics.length === 0
        ) {
            return 50;
        }

        let weightedScore = 0;
        let totalWeight = 0;

        for (
            let i = 0;
            i < statistics.length;
            i++
        ) {
            const stat = statistics[i];

            const weight =
                statistics.length - i;

            const matches =
                Number(
                    stat.matches_played
                );

            if (matches === 0) {
                continue;
            }

            const wins =
                Number(stat.wins);

            const draws =
                Number(stat.draws);

            const points =
                wins * 3 + draws;

            const maxPoints =
                matches * 3;

            const performance =
                maxPoints > 0
                    ? points /
                      maxPoints
                    : 0.5;

            weightedScore +=
                performance * weight;

            totalWeight += weight;
        }

        if (totalWeight === 0) {
            return 50;
        }

        return Number(
            (
                (weightedScore /
                    totalWeight) *
                100
            ).toFixed(2)
        );
    }
}

module.exports =
    new RecentFormService();