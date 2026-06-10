const prisma = require("../config/prisma");

class MarketService {
    async getAll() {
        return prisma.markets.findMany({
            include: {
                matches: true,
                market_types: true,
                prediction_versions: true,
                players: true
            },
            orderBy: {
                market_id: "desc"
            }
        });
    }

    async getById(marketId) {
        return prisma.markets.findUnique({
            where: {
                market_id: BigInt(marketId)
            },
            include: {
                matches: true,
                market_types: true,
                prediction_versions: true,
                players: true
            }
        });
    }

    async getByMatch(matchId) {
        return prisma.markets.findMany({
            where: {
                match_id: BigInt(matchId),
                is_active: true
            },
            include: {
                market_types: true,
                players: true,
                prediction_versions: true
            },
            orderBy: {
                probability: "desc"
            }
        });
    }

    async getByPredictionVersion(
        predictionVersionId
    ) {
        return prisma.markets.findMany({
            where: {
                prediction_version_id:
                    BigInt(
                        predictionVersionId
                    )
            },
            include: {
                market_types: true,
                players: true
            }
        });
    }

    async create(data) {
    const [
        match,
        marketType,
        predictionVersion
    ] = await Promise.all([
        prisma.matches.findUnique({
            where: {
                match_id:
                    BigInt(data.match_id)
            }
        }),

        prisma.market_types.findUnique({
            where: {
                market_type_id:
                    BigInt(
                        data.market_type_id
                    )
            }
        }),

        prisma.prediction_versions.findUnique({
            where: {
                prediction_version_id:
                    BigInt(
                        data.prediction_version_id
                    )
            }
        })
    ]);

    if (!match) {
        throw new Error(
            "Partido no encontrado"
        );
    }

    if (!marketType) {
        throw new Error(
            "Tipo de mercado no encontrado"
        );
    }

    if (!predictionVersion) {
        throw new Error(
            "Versión de predicción no encontrada"
        );
    }

    if (
        predictionVersion.match_id !==
        BigInt(data.match_id)
    ) {
        throw new Error(
            "La versión de predicción no pertenece al partido"
        );
    }

    if (data.player_id) {
        const player =
            await prisma.players.findUnique({
                where: {
                    player_id:
                        BigInt(
                            data.player_id
                        )
                }
            });

        if (!player) {
            throw new Error(
                "Jugador no encontrado"
            );
        }
    }

    if (
        Number(data.probability) < 0 ||
        Number(data.probability) > 100
    ) {
        throw new Error(
            "La probabilidad debe estar entre 0 y 100"
        );
    }

    if (
        Number(data.points_value) < 0
    ) {
        throw new Error(
            "Los puntos deben ser mayores o iguales a 0"
        );
    }

    return prisma.markets.create({
        data: {
            match_id:
                BigInt(data.match_id),

            prediction_version_id:
                BigInt(
                    data.prediction_version_id
                ),

            market_type_id:
                BigInt(
                    data.market_type_id
                ),

            player_id:
                data.player_id
                    ? BigInt(
                          data.player_id
                      )
                    : null,

            probability:
                Number(
                    data.probability
                ),

            points_value:
                Number(
                    data.points_value
                ),

            is_active:
                data.is_active ??
                true
        }
    });
}

    async update(
        marketId,
        data
    ) {
        const market =
            await prisma.markets.findUnique({
                where: {
                    market_id:
                        BigInt(marketId)
                }
            });

        if (!market) {
            throw new Error(
                "Mercado no encontrado"
            );
        }

        return prisma.markets.update({
            where: {
                market_id:
                    BigInt(marketId)
            },

            data: {
                probability:
                    data.probability !==
                    undefined
                        ? Number(
                              data.probability
                          )
                        : undefined,

                points_value:
                    data.points_value !==
                    undefined
                        ? Number(
                              data.points_value
                          )
                        : undefined,

                is_active:
                    data.is_active !==
                    undefined
                        ? Boolean(
                              data.is_active
                          )
                        : undefined
            }
        });
    }

    async deactivate(
        marketId
    ) {
        const market =
            await prisma.markets.findUnique({
                where: {
                    market_id:
                        BigInt(marketId)
                }
            });

        if (!market) {
            throw new Error(
                "Mercado no encontrado"
            );
        }

        return prisma.markets.update({
            where: {
                market_id:
                    BigInt(marketId)
            },
            data: {
                is_active: false
            }
        });
    }

    async delete(
        marketId
    ) {
        const market =
            await prisma.markets.findUnique({
                where: {
                    market_id:
                        BigInt(marketId)
                }
            });

        if (!market) {
            throw new Error(
                "Mercado no encontrado"
            );
        }

        return prisma.markets.delete({
            where: {
                market_id:
                    BigInt(marketId)
            }
        });
    }
}

module.exports =
    new MarketService();