const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   GET /api/players/team/:teamId
 * @desc    Obtiene todos los jugadores pertenecientes a un equipo específico
 */
router.get("/team/:teamId", playerController.getByTeam);

/**
 * @route   GET /api/players/:playerId
 * @desc    Obtiene los detalles de un jugador específico por su ID
 */
router.get("/:playerId", playerController.getOne);

/**
 * @route   POST /api/players
 * @desc    Registra un nuevo jugador y lo asigna a un equipo
 */
router.post("/", playerController.create);

/**
 * @route   PUT /api/players/:playerId
 * @desc    Actualiza los detalles de un jugador existente
 */
router.put("/:playerId", playerController.update);

/**
 * @route   DELETE /api/players/:playerId
 * @desc    Elimina de forma permanente un jugador por su ID
 */
router.delete("/:playerId", playerController.delete);

module.exports = router;