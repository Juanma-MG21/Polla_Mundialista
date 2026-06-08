const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   POST /api/matches
 * @desc    Crea e ingresa un nuevo partido al fixture
 */
router.post("/", matchController.create);

/**
 * @route   GET /api/matches
 * @desc    Obtiene el listado completo de todos los partidos programados e históricos
 */
router.get("/", matchController.getAll);

/**
 * @route   GET /api/matches/upcoming
 * @desc    Obtiene los partidos que están próximos a jugarse (SCHEDULED)
 */
router.get("/upcoming", matchController.getUpcoming);

/**
 * @route   GET /api/matches/head-to-head/:teamA/:teamB
 * @desc    Muestra el historial mutuo de enfrentamientos entre dos equipos (H2H)
 */
router.get("/head-to-head/:teamA/:teamB", matchController.getHeadToHead);

/**
 * @route   GET /api/matches/:matchId
 * @desc    Obtiene la ficha técnica e información detallada de un solo partido
 */
router.get("/:matchId", matchController.getOne);

/**
 * @route   PUT /api/matches/:matchId/score
 * @desc    Actualiza la cantidad de goles anotados por cada bando
 */
router.put("/:matchId/score", matchController.updateScore);

/**
 * @route   PUT /api/matches/:matchId/status
 * @desc    Modifica el estado administrativo del partido (LIVE, FINISHED, CANCELED)
 */
router.put("/:matchId/status", matchController.updateStatus);

module.exports = router;