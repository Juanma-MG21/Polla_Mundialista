const movementsService = require("../services/movements.service");
const authService = require("../services/auth.service");

class MovementsController {
  async getAll(req, res) {
    try {
      await authService.assertAdmin(req.user.userId);
      const limit = Math.min(Number(req.query.limit) || 50, 200);
      const data = await movementsService.getRecent(limit);
      return res.json({ success: true, data });
    } catch (error) {
      const status = error.message.includes("Acceso denegado") ? 403 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}

module.exports = new MovementsController();
