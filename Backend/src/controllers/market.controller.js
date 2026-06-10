const marketService =
    require("../services/market.service");

class MarketController {
    async getAll(req, res) {
        try {
            const result =
                await marketService.getAll();

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { marketId } =
                req.params;

            const result =
                await marketService.getById(
                    marketId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByMatch(req, res) {
        try {
            const { matchId } =
                req.params;

            const result =
                await marketService.getByMatch(
                    matchId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByPredictionVersion(
        req,
        res
    ) {
        try {
            const {
                predictionVersionId
            } = req.params;

            const result =
                await marketService.getByPredictionVersion(
                    predictionVersionId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const result =
                await marketService.create(
                    req.body
                );

            return res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { marketId } =
                req.params;

            const result =
                await marketService.update(
                    marketId,
                    req.body
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deactivate(req, res) {
        try {
            const { marketId } =
                req.params;

            const result =
                await marketService.deactivate(
                    marketId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { marketId } =
                req.params;

            await marketService.delete(
                marketId
            );

            return res.status(200).json({
                success: true,
                message:
                    "Mercado eliminado correctamente"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports =
    new MarketController();