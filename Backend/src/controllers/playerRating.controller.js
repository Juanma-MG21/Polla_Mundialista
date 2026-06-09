const playerRatingService =
    require("../services/playerRating.service");

class PlayerRatingController {
    async createSnapshot(
        req,
        res
    ) {
        try {
            const result =
                await playerRatingService.createSnapshot(
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
            const { playerId } =
                req.params;

            const result =
                await playerRatingService.getLatestRating(
                    playerId
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
            const { playerId } =
                req.params;

            const result =
                await playerRatingService.getHistory(
                    playerId
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
    new PlayerRatingController();