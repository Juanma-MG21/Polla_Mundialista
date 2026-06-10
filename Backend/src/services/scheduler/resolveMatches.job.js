const prisma = require("../../config/prisma");
const marketResolver = require("../resolution/marketResolver.service");

async function resolveMatches() {
    const matches = await prisma.matches.findMany({
        where: {
            status: { in: ["FINISHED", "CANCELLED", "POSTPONED"] }
        },
        select: { match_id: true }
    });

    const results = [];

    for (const match of matches) {
        try {
            const resolved = await marketResolver.resolveMatchMarkets(match.match_id);
            results.push({ match_id: String(match.match_id), markets_resolved: resolved.length });
        } catch (err) {
            results.push({ match_id: String(match.match_id), error: err.message });
        }
    }

    return results;
}

module.exports = resolveMatches;