const teamRatingService =
    require("../services/teamRating.service");

class TeamRatingController {
    async createSnapshot(
        req,
        res
    ) {
        try {
            const result =
                await teamRatingService.createSnapshot(
                    req.body
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

    async getLatestRating(
        req,
        res
    ) {
        try {
            const { teamId } =
                req.params;

            const result =
                await teamRatingService.getLatestRating(
                    teamId
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

    async getHistory(
        req,
        res
    ) {
        try {
            const { teamId } =
                req.params;

            const result =
                await teamRatingService.getHistory(
                    teamId
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
}

module.exports =
    new TeamRatingController();