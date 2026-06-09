const teamStatisticsService =
    require("../services/teamStatistics.service");

class TeamStatisticsController {
    async getAll(req, res) {
        try {
            const data =
                await teamStatisticsService.getAll();

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message
            });
        }
    }

    async getByTeam(req, res) {
        try {
            const { teamId } =
                req.params;

            const data =
                await teamStatisticsService.getByTeam(
                    teamId
                );

            return res.status(200).json({
                success: true,
                data
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
            const { teamId } =
                req.params;

            const data =
                await teamStatisticsService.getLatest(
                    teamId
                );

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data =
                await teamStatisticsService.create(
                    req.body
                );

            return res.status(201).json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { statisticId } =
                req.params;

            const data =
                await teamStatisticsService.update(
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
                message:
                    error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { statisticId } =
                req.params;

            await teamStatisticsService.delete(
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
                message:
                    error.message
            });
        }
    }
}

module.exports =
    new TeamStatisticsController();