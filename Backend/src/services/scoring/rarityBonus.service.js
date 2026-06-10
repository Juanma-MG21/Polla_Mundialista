const prisma =
    require("../../config/prisma");

class RarityBonusService {

    async calculateBonus(
        marketId
    ) {

        const market =
            await prisma.markets.findUnique({

                where: {
                    market_id:
                        BigInt(marketId)
                },

                select: {
                    probability: true
                }
            });

        if (!market) {

            throw new Error(
                "Market not found"
            );
        }

        const bettorsCount =
            await prisma.ticket_events.count({

                where: {
                    market_id:
                        BigInt(marketId)
                }
            });

        const probability =
            Number(
                market.probability
            );

        /*
         * Restricción anti-abuso
         *
         * Si solamente existe un apostador
         * y la probabilidad es alta,
         * no se entrega bonus.
         */
        if (
            bettorsCount <= 1 &&
            probability > 15
        ) {

            return 0;
        }

        if (bettorsCount <= 1) {
            return 150;
        }

        if (bettorsCount <= 3) {
            return 100;
        }

        if (bettorsCount <= 5) {
            return 75;
        }

        if (bettorsCount <= 7) {
            return 50;
        }

        if (bettorsCount <= 9) {
            return 25;
        }

        return 0;
    }
}

module.exports =
    new RarityBonusService();