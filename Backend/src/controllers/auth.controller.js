const authService = require("../services/auth.service");

class AuthController {
  /**
   * POST /api/auth/register
   * Body: { username, email, password, first_name?, last_name? }
   */
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message, 
      });
    }
  }

  /**
   * POST /api/auth/login
   * Body: { email, password }
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/auth/me
   * Requiere: authMiddleware
   * Devuelve perfil completo y actualizado desde la DB,
   * incluyendo user_scores.
   */
  async me(req, res) {
    try {
      const user = await authService.getProfile(req.user.userId);
      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
