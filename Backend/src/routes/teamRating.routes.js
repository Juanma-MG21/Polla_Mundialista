const express = require("express");
const router = express.Router();
const teamRatingController = require("../controllers/teamRating.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   POST /api/team-ratings
 * @desc    Registra un nuevo snapshot de rendimiento para un equipo
 */
router.post("/", teamRatingController.create);

/**
 * @route   GET /api/team-ratings/latest/:teamId
 * @desc    Obtiene la calificación vigente más reciente de un equipo
 */
router.get("/latest/:teamId", teamRatingController.latest);

/**
 * @route   GET /api/team-ratings/history/:teamId
 * @desc    Obtiene el registro analítico e histórico de evolución de un equipo
 */
router.get("/history/:teamId", teamRatingController.history);

module.exports = router;