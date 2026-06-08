const express = require("express");
const router = express.Router();
const playerRatingController = require("../controllers/playerRating.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   POST /api/player-ratings
 * @desc    Registra un nuevo snapshot de rendimiento para un jugador
 */
router.post("/", playerRatingController.create);

/**
 * @route   GET /api/player-ratings/latest/:playerId
 * @desc    Obtiene la calificación vigente más reciente de un jugador específico
 */
router.get("/latest/:playerId", playerRatingController.latest);

/**
 * @route   GET /api/player-ratings/history/:playerId
 * @desc    Obtiene todo el historial de fluctuación y rendimiento del jugador (útil para gráficos de línea)
 */
router.get("/history/:playerId", playerRatingController.history);

module.exports = router;