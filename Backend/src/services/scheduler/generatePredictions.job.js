const prisma = require("../../config/prisma");
const predictionService = require("../prediction/prediction.service");
const predictionVersionService = require("../predictionVersion.service");

async function generatePredictions() {
    const matches = await prisma.matches.findMany({
        where: { status: "SCHEDULED" },
        select: { match_id: true }
    });

    const results = [];

    for (const match of matches) {
        try {
            const version = await predictionVersionService.create(match.match_id);
            const prediction = await predictionService.generatePrediction(match.match_id);
            results.push({ match_id: String(match.match_id), version: version.version_number, prediction: prediction.prediction });
        } catch (err) {
            results.push({ match_id: String(match.match_id), error: err.message });
        }
    }

    return results;
}

module.exports = generatePredictions;