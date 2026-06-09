const playerStatisticsService =
    require("../services/playerStatistics.service");

class PlayerStatisticsController {
    async getAll(req, res) {
        try {
            const data =
                await playerStatisticsService.getAll();

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByPlayer(req, res) {
        try {
            const { playerId } = req.params;

            const data =
                await playerStatisticsService.getByPlayer(
                    playerId
                );

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getLatest(req, res) {
        try {
            const { playerId } = req.params;

            const data =
                await playerStatisticsService.getLatest(
                    playerId
                );

            return res.status(200).json({
                success: true,
                data
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
            const data =
                await playerStatisticsService.create(
                    req.body
                );

            return res.status(201).json({
                success: true,
                data
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
            const { statisticId } =
                req.params;

            const data =
                await playerStatisticsService.update(
                    statisticId,
                    req.body
                );

            return res.status(200).json({
                success: true,
                data
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
            const { statisticId } =
                req.params;

            await playerStatisticsService.delete(
                statisticId
            );

            return res.status(200).json({
                success: true,
                message:
                    "Registro eliminado"
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
    new PlayerStatisticsController();