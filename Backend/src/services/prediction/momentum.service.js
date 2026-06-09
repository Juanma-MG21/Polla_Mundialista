const prisma = require("../../config/prisma");

class MomentumService {
    async calculate(teamId) {
        const ratings = await prisma.team_ratings.findMany({
            where: {
                team_id: Number(teamId)
            },
            orderBy: {
                rating_date: "asc"
            }
        });

        if (ratings.length < 2) {
            return 50;
        }

        const values = ratings.map(r =>
            Number(r.final_rating)
        );

        const segmentSize = Math.max(
            1,
            Math.floor(values.length * 0.2)
        );

        const firstSegment = values.slice(
            0,
            segmentSize
        );

        const lastSegment = values.slice(
            values.length - segmentSize
        );

        const firstAverage =
            firstSegment.reduce((a, b) => a + b, 0) /
            firstSegment.length;

        const lastAverage =
            lastSegment.reduce((a, b) => a + b, 0) /
            lastSegment.length;

        const variation =
            lastAverage - firstAverage;

        const momentum =
            Math.max(
                0,
                Math.min(
                    100,
                    50 + variation
                )
            );

        return Number(momentum.toFixed(2));
    }
}

module.exports = new MomentumService();