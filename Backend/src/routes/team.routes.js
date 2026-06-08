const express = require("express");
const router = express.Router();
const teamController = require("../controllers/team.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   GET /api/teams
 * @desc    Obtiene el listado de todos los equipos ordenados alfabéticamente
 */
router.get("/", teamController.getAll);

/**
 * @route   GET /api/teams/:teamId
 * @desc    Obtiene los detalles de un equipo específico por su ID
 */
router.get("/:teamId", teamController.getOne);

/**
 * @route   POST /api/teams
 * @desc    Registra un nuevo equipo en la plataforma
 */
router.post("/", teamController.create);

/**
 * @route   PUT /api/teams/:teamId
 * @desc    Actualiza por completo el nombre de un equipo existente
 */
router.put("/:teamId", teamController.update);

/**
 * @route   DELETE /api/teams/:teamId
 * @desc    Elimina de forma permanente un equipo por su ID
 */
router.delete("/:teamId", teamController.delete);

module.exports = router;