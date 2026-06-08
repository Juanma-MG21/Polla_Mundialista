const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route  POST /api/auth/register
 * @desc   Registro de nuevo usuario
 * @access Público
 */
router.post("/register", authController.register);

/**
 * @route  POST /api/auth/login
 * @desc   Login con email y contraseña
 * @access Público
 */
router.post("/login", authController.login);

/**
 * @route  GET /api/auth/me
 * @desc   Perfil completo del usuario autenticado
 * @access Privado (requiere JWT)
 */
router.get("/me", authMiddleware, authController.me);

module.exports = router;
