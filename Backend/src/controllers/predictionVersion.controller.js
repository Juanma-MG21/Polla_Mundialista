const predictionVersionService =
    require("../services/predictionVersion.service");

class PredictionVersionController {
    async create(req, res) {
        try {
            const { matchId } =
                req.params;

            const result =
                await predictionVersionService.create(
                    matchId
                );

            return res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }
    }

    async getByMatch(req, res) {
        try {
            const { matchId } =
                req.params;

            const result =
                await predictionVersionService.getByMatch(
                    matchId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message
            });
        }
    }

    async getLatest(req, res) {
        try {
            const { matchId } =
                req.params;

            const result =
                await predictionVersionService.getLatest(
                    matchId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message
            });
        }
    }

    async deactivate(req, res) {
        try {
            const { versionId } =
                req.params;

            const result =
                await predictionVersionService.deactivate(
                    versionId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }
    }
}

module.exports =
    new PredictionVersionController();