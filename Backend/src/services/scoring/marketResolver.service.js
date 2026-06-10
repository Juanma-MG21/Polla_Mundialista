const prisma = require("../../config/prisma");

class MarketResolverService {
    async resolveMatchMarkets(matchId) {
        const match = await prisma.matches.findUnique({
            where: { match_id: BigInt(matchId) }
        });

        if (!match) throw new Error("Match not found");

        const voidStatuses = ["CANCELLED", "POSTPONED", "ABANDONED"];
        const resolvableStatuses = ["FINISHED", "CANCELLED", "POSTPONED", "ABANDONED"];

        if (!resolvableStatuses.includes(match.status)) {
            throw new Error("Match cannot be resolved yet");
        }

        if (
            !voidStatuses.includes(match.status) &&
            (match.home_score === null || match.away_score === null)
        ) {
            throw new Error("Match scores are required to resolve markets");
        }

        const markets = await prisma.markets.findMany({
            where: { match_id: BigInt(matchId) },
            include: { market_types: true }
        });

        const existingResults = await prisma.market_results.findMany({
            where: {
                market_id: { in: markets.map(m => m.market_id) }
            }
        });

        const resolvedMarketIds = new Set(
            existingResults.map(r => r.market_id.toString())
        );

        const results = [];

        for (const market of markets) {
            if (resolvedMarketIds.has(market.market_id.toString())) continue;

            let resultStatus = "LOST";

            if (voidStatuses.includes(match.status)) {
                resultStatus = "VOID";
            } else {
                const code = market.market_types.code;

                switch (code) {
                    case "HOME_WIN":
                        resultStatus = match.home_score > match.away_score ? "WON" : "LOST";
                        break;
                    case "DRAW":
                        resultStatus = match.home_score === match.away_score ? "WON" : "LOST";
                        break;
                    case "AWAY_WIN":
                        resultStatus = match.away_score > match.home_score ? "WON" : "LOST";
                        break;
                    default:
                        resultStatus = "VOID";
                }
            }

            const createdResult = await prisma.market_results.create({
                data: {
                    market_id: market.market_id,
                    result_status: resultStatus,
                    resolved_at: new Date()
                }
            });

            results.push(createdResult);
        }

        return results;
    }
}

module.exports = new MarketResolverService();