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

  /**
   * GET /api/auth/usuarios
   * Requiere: authMiddleware + rol ADMIN
   */
  async getUsuarios(req, res) {
    try {
      await authService.assertAdmin(req.user.userId);
      const usuarios = await authService.listUsers();
      return res.json({
        ok: true,
        usuarios,
      });
    } catch (error) {
      const status = error.message.includes("Acceso denegado") ? 403 : 500;
      return res.status(status).json({
        ok: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * GET /api/auth/roles
   * Requiere: authMiddleware + rol ADMIN
   */
  async getRoles(req, res) {
    try {
      await authService.assertAdmin(req.user.userId);
      const roles = await authService.listRoles();
      return res.json({
        ok: true,
        roles,
      });
    } catch (error) {
      const status = error.message.includes("Acceso denegado") ? 403 : 500;
      return res.status(status).json({
        ok: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * PUT /api/auth/usuarios/:userId
   * Requiere: authMiddleware + rol ADMIN
   */
  async updateUsuario(req, res) {
    try {
      await authService.assertAdmin(req.user.userId);
      const usuario = await authService.updateUser(req.params.userId, req.body);
      return res.json({
        ok: true,
        usuario,
      });
    } catch (error) {
      const status = error.message.includes("Acceso denegado")
        ? 403
        : error.message.includes("requeridos") || error.message.includes("válido") || error.message.includes("en uso")
          ? 400
          : 500;
      return res.status(status).json({
        ok: false,
        mensaje: error.message,
      });
    }
  }

  /**
   * DELETE /api/auth/usuarios/:userId
   * Requiere: authMiddleware + rol ADMIN
   */
  async deleteUsuario(req, res) {
    try {
      await authService.assertAdmin(req.user.userId);
      await authService.deleteUser(req.params.userId);
      return res.json({
        ok: true,
        mensaje: "Usuario eliminado correctamente",
      });
    } catch (error) {
      const status = error.message.includes("Acceso denegado") ? 403 : 500;
      return res.status(status).json({
        ok: false,
        mensaje: error.message,
      });
    }
  }
}

module.exports = new AuthController();
