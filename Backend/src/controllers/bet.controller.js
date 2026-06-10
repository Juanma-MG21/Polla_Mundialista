const betHistoryService = require("../services/betHistory.service");

class BetController {
  async getHistory(req, res) {
    try {
      const data = await betHistoryService.getUserHistory(req.user.userId);
      return res.json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new BetController();
