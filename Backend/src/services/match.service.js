const prisma = require("../config/prisma");

class MatchService {
    async createMatch(matchData) {
        const {
            home_team_id,
            away_team_id,
            match_datetime
        } = matchData;

        if (!home_team_id || !away_team_id) {
            throw new Error(
                "Ambos equipos son obligatorios"
            );
        }

        if (
            Number(home_team_id) ===
            Number(away_team_id)
        ) {
            throw new Error(
                "Un equipo no puede jugar contra sí mismo"
            );
        }

        const [homeTeam, awayTeam] =
            await Promise.all([
                prisma.teams.findUnique({
                    where: {
                        team_id: BigInt(home_team_id)
                    }
                }),

                prisma.teams.findUnique({
                    where: {
                        team_id: BigInt(away_team_id)
                    }
                })
            ]);

        if (!homeTeam) {
            throw new Error(
                "Equipo local no encontrado"
            );
        }

        if (!awayTeam) {
            throw new Error(
                "Equipo visitante no encontrado"
            );
        }

        return prisma.matches.create({
            data: {
                home_team_id: BigInt(
                    home_team_id
                ),

                away_team_id: BigInt(
                    away_team_id
                ),

                match_datetime:
                    match_datetime
                        ? new Date(
                              match_datetime
                          )
                        : new Date(),

                status: "SCHEDULED"
            }
        });
    }

    async getMatch(matchId) {
        return prisma.matches.findUnique({
            where: {
                match_id: BigInt(matchId)
            },
            include: {
                teams_matches_home_team_idToteams: true,
                teams_matches_away_team_idToteams: true
            }
        });
    }

    async getAllMatches() {
        return prisma.matches.findMany({
            include: {
                teams_matches_home_team_idToteams: true,
                teams_matches_away_team_idToteams: true
            },
            orderBy: {
                match_datetime: "asc"
            }
        });
    }

    async getUpcomingMatches() {
        return prisma.matches.findMany({
            where: {
                status: "SCHEDULED"
            },
            include: {
                teams_matches_home_team_idToteams: true,
                teams_matches_away_team_idToteams: true
            },
            orderBy: {
                match_datetime: "asc"
            }
        });
    }

    async updateScore(
        matchId,
        homeGoals,
        awayGoals
    ) {
        const match =
            await prisma.matches.findUnique({
                where: {
                    match_id:
                        BigInt(matchId)
                }
            });

        if (!match) {
            throw new Error(
                "Partido no encontrado"
            );
        }

        if (
            homeGoals !== null &&
            homeGoals !== undefined &&
            Number(homeGoals) < 0
        ) {
            throw new Error(
                "Los goles locales no pueden ser negativos"
            );
        }

        if (
            awayGoals !== null &&
            awayGoals !== undefined &&
            Number(awayGoals) < 0
        ) {
            throw new Error(
                "Los goles visitantes no pueden ser negativos"
            );
        }

        return prisma.matches.update({
            where: {
                match_id:
                    BigInt(matchId)
            },
            data: {
                home_score:
                    homeGoals !== null &&
                    homeGoals !== undefined
                        ? Number(homeGoals)
                        : null,

                away_score:
                    awayGoals !== null &&
                    awayGoals !== undefined
                        ? Number(awayGoals)
                        : null
            }
        });
    }

    async updateStatus(
        matchId,
        status
    ) {
        if (
            !status ||
            !status.trim()
        ) {
            throw new Error(
                "El estado es obligatorio"
            );
        }

        const validStatuses = [
            "SCHEDULED",
            "LIVE",
            "FINISHED",
            "POSTPONED",
            "CANCELLED"
        ];

        const normalizedStatus =
            status.trim().toUpperCase();

        if (
            !validStatuses.includes(
                normalizedStatus
            )
        ) {
            throw new Error(
                "Estado inválido"
            );
        }

        const match =
            await prisma.matches.findUnique({
                where: {
                    match_id:
                        BigInt(matchId)
                }
            });

        if (!match) {
            throw new Error(
                "Partido no encontrado"
            );
        }

        return prisma.matches.update({
            where: {
                match_id:
                    BigInt(matchId)
            },
            data: {
                status:
                    normalizedStatus
            }
        });
    }

    async getHeadToHead(
        teamA,
        teamB
    ) {
        return prisma.matches.findMany({
            where: {
                OR: [
                    {
                        home_team_id:
                            BigInt(teamA),

                        away_team_id:
                            BigInt(teamB)
                    },
                    {
                        home_team_id:
                            BigInt(teamB),

                        away_team_id:
                            BigInt(teamA)
                    }
                ]
            },

            include: {
                teams_matches_home_team_idToteams: true,
                teams_matches_away_team_idToteams: true
            },

            orderBy: {
                match_datetime:
                    "desc"
            }
        });
    }
}

module.exports =
    new MatchService();