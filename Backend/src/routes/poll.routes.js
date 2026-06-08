const express = require("express");
const router = express.Router();
const pollController = require("../controllers/poll.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   POST /api/polls/room/:roomId
 * @desc    Crea una nueva encuesta dentro de una sala específica
 */
router.post("/room/:roomId", pollController.create);

/**
 * @route   GET /api/polls/room/:roomId
 * @desc    Obtiene todas las encuestas creadas en una sala específica
 */
router.get("/room/:roomId", pollController.getRoomPolls);

/**
 * @route   GET /api/polls/:pollId
 * @desc    Obtiene los detalles de una encuesta específica por su ID
 */
router.get("/:pollId", pollController.getPoll);

/**
 * @route   POST /api/polls/:pollId/vote
 * @desc    Registra el voto de un usuario en una opción de la encuesta
 */
router.post("/:pollId/vote", pollController.vote);

/**
 * @route   PUT /api/polls/:pollId/close
 * @desc    Cierre de una encuesta abierta para detener la recepción de votos
 */
router.put("/:pollId/close", pollController.close);

module.exports = router;