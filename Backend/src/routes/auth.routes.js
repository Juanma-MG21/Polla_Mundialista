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

/**
 * @route  GET /api/auth/usuarios
 * @desc   Lista todos los usuarios (solo ADMIN)
 * @access Privado
 */
router.get("/usuarios", authMiddleware, authController.getUsuarios);

/**
 * @route  GET /api/auth/roles
 * @desc   Lista roles disponibles (solo ADMIN)
 * @access Privado
 */
router.get("/roles", authMiddleware, authController.getRoles);

/**
 * @route  PUT /api/auth/usuarios/:userId
 * @desc   Actualiza un usuario (solo ADMIN)
 * @access Privado
 */
router.put("/usuarios/:userId", authMiddleware, authController.updateUsuario);

/**
 * @route  DELETE /api/auth/usuarios/:userId
 * @desc   Elimina un usuario (solo ADMIN)
 * @access Privado
 */
router.delete("/usuarios/:userId", authMiddleware, authController.deleteUsuario);

module.exports = router;
