const prisma = require("../../config/prisma");

class ContextService {
    async calculate(matchId) {
        const match =
            await prisma.matches.findUnique({
                where: {
                    match_id: Number(matchId)
                }
            });

        if (!match) {
            throw new Error(
                "Partido no encontrado"
            );
        }

        const homePlayers =
            await prisma.players.findMany({
                where: {
                    team_id:
                        match.home_team_id
                },
                select: {
                    player_id: true
                }
            });

        const awayPlayers =
            await prisma.players.findMany({
                where: {
                    team_id:
                        match.away_team_id
                },
                select: {
                    player_id: true
                }
            });

        const homeIds =
            homePlayers.map(
                p => p.player_id
            );

        const awayIds =
            awayPlayers.map(
                p => p.player_id
            );

        const [
            homeInjuries,
            awayInjuries
        ] = await Promise.all([
            prisma.injuries.count({
                where: {
                    player_id: {
                        in: homeIds
                    },
                    is_active: true
                }
            }),
            prisma.injuries.count({
                where: {
                    player_id: {
                        in: awayIds
                    },
                    is_active: true
                }
            })
        ]);

        const homeAdvantage = 10;

        const injuryDelta =
            awayInjuries -
            homeInjuries;

        const context =
            50 +
            homeAdvantage +
            injuryDelta * 2;

        return Number(
            Math.max(
                0,
                Math.min(100, context)
            ).toFixed(2)
        );
    }
}

module.exports =
    new ContextService();