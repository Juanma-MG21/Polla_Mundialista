const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Proteger todas las rutas de este módulo con el middleware de autenticación
router.use(authMiddleware);

/**
 * @route   POST /api/chat/room/:roomId
 * @desc    Envía un nuevo mensaje de texto a una sala específica
 */
router.post("/room/:roomId", chatController.send);

/**
 * @route   GET /api/chat/room/:roomId
 * @desc    Obtiene el historial de mensajes de una sala específica (soporta query ?limit=X)
 */
router.get("/room/:roomId", chatController.getMessages);

/**
 * @route   GET /api/chat/message/:messageId
 * @desc    Obtiene los detalles de un mensaje individual por su ID único
 */
router.get("/message/:messageId", chatController.getMessage);

module.exports = router;