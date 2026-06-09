const prisma = require("../config/prisma");

class PlayerService {
    async getAllPlayers() {
        return prisma.players.findMany({
            include: {
                teams: true
            },
            orderBy: [
                {
                    first_name: "asc"
                },
                {
                    last_name: "asc"
                }
            ]
        });
    }

    async getPlayersByTeam(teamId) {
        return prisma.players.findMany({
            where: {
                team_id: BigInt(teamId)
            },
            include: {
                teams: true
            },
            orderBy: [
                {
                    first_name: "asc"
                },
                {
                    last_name: "asc"
                }
            ]
        });
    }

    async getPlayer(playerId) {
        return prisma.players.findUnique({
            where: {
                player_id: BigInt(playerId)
            },
            include: {
                teams: true,
                injuries: true,
                player_statistics: true,
                player_ratings: true
            }
        });
    }

    async createPlayer(playerData) {
        const {
            first_name,
            last_name,
            birth_date,
            position,
            team_id
        } = playerData;

        if (!first_name?.trim()) {
            throw new Error(
                "El nombre es obligatorio"
            );
        }

        if (!last_name?.trim()) {
            throw new Error(
                "El apellido es obligatorio"
            );
        }

        if (team_id) {
            const team =
                await prisma.teams.findUnique({
                    where: {
                        team_id: BigInt(team_id)
                    }
                });

            if (!team) {
                throw new Error(
                    "Equipo no encontrado"
                );
            }
        }

        return prisma.players.create({
            data: {
                first_name:
                    first_name.trim(),

                last_name:
                    last_name.trim(),

                birth_date:
                    birth_date
                        ? new Date(
                              birth_date
                          )
                        : null,

                position:
                    position?.trim() ||
                    null,

                team_id:
                    team_id
                        ? BigInt(team_id)
                        : null
            }
        });
    }

    async updatePlayer(
        playerId,
        playerData
    ) {
        const player =
            await prisma.players.findUnique({
                where: {
                    player_id:
                        BigInt(playerId)
                }
            });

        if (!player) {
            throw new Error(
                "Jugador no encontrado"
            );
        }

        if (
            playerData.team_id !==
            undefined
        ) {
            if (
                playerData.team_id !==
                null
            ) {
                const team =
                    await prisma.teams.findUnique(
                        {
                            where: {
                                team_id:
                                    BigInt(
                                        playerData.team_id
                                    )
                            }
                        }
                    );

                if (!team) {
                    throw new Error(
                        "Equipo no encontrado"
                    );
                }
            }
        }

        return prisma.players.update({
            where: {
                player_id:
                    BigInt(playerId)
            },

            data: {
                first_name:
                    playerData.first_name?.trim(),

                last_name:
                    playerData.last_name?.trim(),

                birth_date:
                    playerData.birth_date
                        ? new Date(
                              playerData.birth_date
                          )
                        : undefined,

                position:
                    playerData.position
                        ?.trim(),

                team_id:
                    playerData.team_id !==
                    undefined
                        ? playerData.team_id
                            ? BigInt(
                                  playerData.team_id
                              )
                            : null
                        : undefined
            }
        });
    }

    async deletePlayer(playerId) {
        const player =
            await prisma.players.findUnique({
                where: {
                    player_id:
                        BigInt(playerId)
                }
            });

        if (!player) {
            throw new Error(
                "Jugador no encontrado"
            );
        }

        return prisma.players.delete({
            where: {
                player_id:
                    BigInt(playerId)
            }
        });
    }
}

module.exports =
    new PlayerService();