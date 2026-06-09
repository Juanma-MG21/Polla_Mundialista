const predictionService = require("../services/prediction/prediction.service");

class PredictionController {
    async generatePrediction(req, res) {
        try {
            const { matchId } = req.params;

            const prediction =
                await predictionService.generatePrediction(
                    matchId
                );

            return res.status(200).json({
                success: true,
                data: prediction
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new PredictionController();