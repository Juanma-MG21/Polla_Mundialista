const prisma =
    require("../../config/prisma");

class FirstBettorBonusService {

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
                    market_id: true
                }
            });

        if (!market) {

            throw new Error(
                "Market not found"
            );
        }

        const existingBets =
            await prisma.ticket_events.count({

                where: {
                    market_id:
                        BigInt(marketId)
                }
            });

        /*
         * Si no existe ningún ticket_event
         * asociado al mercado,
         * el usuario recibe el bonus
         * de primer apostador.
         */
        if (
            existingBets === 0
        ) {

            return 50;
        }

        return 0;
    }
}

module.exports =
    new FirstBettorBonusService();