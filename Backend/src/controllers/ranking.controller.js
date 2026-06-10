const rankingService = require("../services/ranking.service");

class RankingController {
    async getRoomRanking(req, res) {
        try {
            const { roomId } = req.params;
            const ranking = await rankingService.getRoomRanking(roomId);

            return res.status(200).json({ success: true, data: ranking });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getUserStats(req, res) {
        try {
            const { roomId } = req.params;
            const stats = await rankingService.getUserStatsInRoom(req.user.userId, roomId);

            return res.status(200).json({ success: true, data: stats });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new RankingController();