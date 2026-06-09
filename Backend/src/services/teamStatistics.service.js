const prisma = require("../config/prisma");

class TeamStatisticsService {
    async getAll() {
        return prisma.team_statistics.findMany({
            include: {
                teams: true
            },
            orderBy: [
                {
                    snapshot_date: "desc"
                }
            ]
        });
    }

    async getByTeam(teamId) {
        return prisma.team_statistics.findMany({
            where: {
                team_id: BigInt(teamId)
            },
            include: {
                teams: true
            },
            orderBy: {
                snapshot_date: "desc"
            }
        });
    }

    async getLatest(teamId) {
        return prisma.team_statistics.findFirst({
            where: {
                team_id: BigInt(teamId)
            },
            orderBy: {
                snapshot_date: "desc"
            }
        });
    }

    async create(data) {
        const team =
            await prisma.teams.findUnique({
                where: {
                    team_id: BigInt(data.team_id)
                }
            });

        if (!team) {
            throw new Error(
                "Equipo no encontrado"
            );
        }

        return prisma.team_statistics.create({
            data: {
                team_id: BigInt(data.team_id),

                snapshot_date:
                    data.snapshot_date
                        ? new Date(
                              data.snapshot_date
                          )
                        : new Date(),

                matches_played:
                    Number(
                        data.matches_played || 0
                    ),

                wins: Number(
                    data.wins || 0
                ),

                draws: Number(
                    data.draws || 0
                ),

                losses: Number(
                    data.losses || 0
                ),

                goals_for:
                    Number(
                        data.goals_for || 0
                    ),

                goals_against:
                    Number(
                        data.goals_against || 0
                    ),

                clean_sheets:
                    Number(
                        data.clean_sheets || 0
                    )
            }
        });
    }

    async update(
        statisticId,
        data
    ) {
        const statistic =
            await prisma.team_statistics.findUnique(
                {
                    where: {
                        team_statistic_id:
                            BigInt(
                                statisticId
                            )
                    }
                }
            );

        if (!statistic) {
            throw new Error(
                "Registro no encontrado"
            );
        }

        return prisma.team_statistics.update(
            {
                where: {
                    team_statistic_id:
                        BigInt(
                            statisticId
                        )
                },

                data: {
                    matches_played:
                        data.matches_played !==
                        undefined
                            ? Number(
                                  data.matches_played
                              )
                            : undefined,

                    wins:
                        data.wins !==
                        undefined
                            ? Number(
                                  data.wins
                              )
                            : undefined,

                    draws:
                        data.draws !==
                        undefined
                            ? Number(
                                  data.draws
                              )
                            : undefined,

                    losses:
                        data.losses !==
                        undefined
                            ? Number(
                                  data.losses
                              )
                            : undefined,

                    goals_for:
                        data.goals_for !==
                        undefined
                            ? Number(
                                  data.goals_for
                              )
                            : undefined,

                    goals_against:
                        data.goals_against !==
                        undefined
                            ? Number(
                                  data.goals_against
                              )
                            : undefined,

                    clean_sheets:
                        data.clean_sheets !==
                        undefined
                            ? Number(
                                  data.clean_sheets
                              )
                            : undefined
                }
            }
        );
    }

    async delete(statisticId) {
        const statistic =
            await prisma.team_statistics.findUnique(
                {
                    where: {
                        team_statistic_id:
                            BigInt(
                                statisticId
                            )
                    }
                }
            );

        if (!statistic) {
            throw new Error(
                "Registro no encontrado"
            );
        }

        return prisma.team_statistics.delete(
            {
                where: {
                    team_statistic_id:
                        BigInt(
                            statisticId
                        )
                }
            }
        );
    }
}

module.exports =
    new TeamStatisticsService();