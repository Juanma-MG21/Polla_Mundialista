const express = require("express");
const router = express.Router();
const injuryController = require("../controllers/injury.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   GET /api/injuries/team/:teamId
 * @desc    Obtiene todas las lesiones activas de un equipo específico
 */
router.get("/team/:teamId", injuryController.getActive);

/**
 * @route   POST /api/injuries
 * @desc    Registra un nuevo reporte de lesión
 */
router.post("/", injuryController.create);

/**
 * @route   PUT /api/injuries/:injuryId/resolve
 * @desc    Registra el alta médica de un jugador (cambia el estado is_active a false)
 */
router.put("/:injuryId/resolve", injuryController.resolve);

module.exports = router;