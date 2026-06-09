const prisma = require("../config/prisma");

class PlayerStatisticsService {
    async getAll() {
        return prisma.player_statistics.findMany({
            include: {
                players: true
            },
            orderBy: {
                snapshot_date: "desc"
            }
        });
    }

    async getByPlayer(playerId) {
        return prisma.player_statistics.findMany({
            where: {
                player_id: BigInt(playerId)
            },
            include: {
                players: true
            },
            orderBy: {
                snapshot_date: "desc"
            }
        });
    }

    async getLatest(playerId) {
        return prisma.player_statistics.findFirst({
            where: {
                player_id: BigInt(playerId)
            },
            orderBy: {
                snapshot_date: "desc"
            }
        });
    }

    async create(data) {
        const player =
            await prisma.players.findUnique({
                where: {
                    player_id: BigInt(
                        data.player_id
                    )
                }
            });

        if (!player) {
            throw new Error(
                "Jugador no encontrado"
            );
        }

        return prisma.player_statistics.create({
            data: {
                player_id: BigInt(
                    data.player_id
                ),

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

                minutes_played:
                    Number(
                        data.minutes_played || 0
                    ),

                goals:
                    Number(
                        data.goals || 0
                    ),

                shots_on_target:
                    Number(
                        data.shots_on_target || 0
                    ),

                yellow_cards:
                    Number(
                        data.yellow_cards || 0
                    ),

                red_cards:
                    Number(
                        data.red_cards || 0
                    )
            }
        });
    }

    async update(
        statisticId,
        data
    ) {
        const statistic =
            await prisma.player_statistics.findUnique(
                {
                    where: {
                        player_statistic_id:
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

        return prisma.player_statistics.update(
            {
                where: {
                    player_statistic_id:
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

                    minutes_played:
                        data.minutes_played !==
                        undefined
                            ? Number(
                                  data.minutes_played
                              )
                            : undefined,

                    goals:
                        data.goals !==
                        undefined
                            ? Number(
                                  data.goals
                              )
                            : undefined,

                    shots_on_target:
                        data.shots_on_target !==
                        undefined
                            ? Number(
                                  data.shots_on_target
                              )
                            : undefined,

                    yellow_cards:
                        data.yellow_cards !==
                        undefined
                            ? Number(
                                  data.yellow_cards
                              )
                            : undefined,

                    red_cards:
                        data.red_cards !==
                        undefined
                            ? Number(
                                  data.red_cards
                              )
                            : undefined
                }
            }
        );
    }

    async delete(
        statisticId
    ) {
        const statistic =
            await prisma.player_statistics.findUnique(
                {
                    where: {
                        player_statistic_id:
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

        return prisma.player_statistics.delete(
            {
                where: {
                    player_statistic_id:
                        BigInt(
                            statisticId
                        )
                }
            }
        );
    }
}

module.exports =
    new PlayerStatisticsService();