const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   POST /api/rooms
 * @desc    Crea una nueva sala
 */
router.post("/", roomController.create);

/**
 * @route   POST /api/rooms/join
 * @desc    Une a un usuario a una sala mediante código de acceso
 */
router.post("/join", roomController.join);

/**
 * @route   GET /api/rooms/:roomId
 * @desc    Obtiene los detalles de una sala específica
 */
router.get("/:roomId", roomController.getRoom);

/**
 * @route   GET /api/rooms/:roomId/members
 * @desc    Obtiene la lista de miembros de una sala
 */
router.get("/:roomId/members", roomController.getMembers);

/**
 * @route   PUT /api/rooms/:roomId/transfer
 * @desc    Transfiere la propiedad de la sala a otro usuario
 */
router.put("/:roomId/transfer", roomController.transferOwnership);

/**
 * @route   DELETE /api/rooms/:roomId/leave
 * @desc    Permite a un usuario abandonar una sala
 */
router.delete("/:roomId/leave", roomController.leave);

module.exports = router;