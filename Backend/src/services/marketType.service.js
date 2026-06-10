const prisma = require("../config/prisma");

class MarketTypeService {
    async getAll() {
        return prisma.market_types.findMany({
            orderBy: {
                code: "asc"
            }
        });
    }

    async getById(marketTypeId) {
        return prisma.market_types.findUnique({
            where: {
                market_type_id: BigInt(marketTypeId)
            }
        });
    }

    async getByCode(code) {
        return prisma.market_types.findUnique({
            where: {
                code: code.trim()
            }
        });
    }

    async create(data) {
        if (!data.code?.trim()) {
            throw new Error(
                "El código es obligatorio"
            );
        }

        const existing =
            await prisma.market_types.findUnique({
                where: {
                    code: data.code.trim()
                }
            });

        if (existing) {
            throw new Error(
                "Ya existe un tipo de mercado con ese código"
            );
        }

        return prisma.market_types.create({
            data: {
                code: data.code.trim(),
                description:
                    data.description?.trim() ||
                    null
            }
        });
    }

    async update(
        marketTypeId,
        data
    ) {
        const marketType =
            await prisma.market_types.findUnique({
                where: {
                    market_type_id:
                        BigInt(marketTypeId)
                }
            });

        if (!marketType) {
            throw new Error(
                "Tipo de mercado no encontrado"
            );
        }

        if (
            data.code &&
            data.code.trim() !==
                marketType.code
        ) {
            const existing =
                await prisma.market_types.findUnique({
                    where: {
                        code:
                            data.code.trim()
                    }
                });

            if (existing) {
                throw new Error(
                    "Ya existe un tipo de mercado con ese código"
                );
            }
        }

        return prisma.market_types.update({
            where: {
                market_type_id:
                    BigInt(marketTypeId)
            },
            data: {
                code:
                    data.code?.trim() ||
                    undefined,

                description:
                    data.description !==
                    undefined
                        ? data.description?.trim() ||
                          null
                        : undefined
            }
        });
    }

    async delete(
        marketTypeId
    ) {
        const marketType =
            await prisma.market_types.findUnique({
                where: {
                    market_type_id:
                        BigInt(marketTypeId)
                }
            });

        if (!marketType) {
            throw new Error(
                "Tipo de mercado no encontrado"
            );
        }

        return prisma.market_types.delete({
            where: {
                market_type_id:
                    BigInt(marketTypeId)
            }
        });
    }
}

module.exports =
    new MarketTypeService();