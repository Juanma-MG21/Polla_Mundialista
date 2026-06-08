const chatService = require("../services/chat.service");

class ChatController {
    /**
     * @route   POST /api/chat/room/:roomId
     * @desc    Envía un nuevo mensaje de texto a una sala específica
     */
    async send(req, res) {
        try {
            const { roomId } = req.params;
            const { message } = req.body;

            // Validación preventiva de contenido
            if (!message || !message.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "El contenido del mensaje no puede estar vacío"
                });
            }

            const newMessage = await chatService.sendMessage(
                roomId,
                req.user.userId,
                message
            );

            return res.status(201).json({
                success: true,
                message: "Mensaje enviado exitosamente",
                data: newMessage
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/chat/room/:roomId
     * @desc    Obtiene el historial de mensajes de una sala con un límite opcional
     */
    async getMessages(req, res) {
        try {
            const { roomId } = req.params;
            const { limit } = req.query;

            const messages = await chatService.getMessages(roomId, limit);

            return res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener el historial de mensajes"
            });
        }
    }

    /**
     * @route   GET /api/chat/message/:messageId
     * @desc    Obtiene los detalles de un mensaje individual por su ID único
     */
    async getMessage(req, res) {
        try {
            const { messageId } = req.params;

            const message = await chatService.getMessage(messageId);

            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: "Mensaje no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener el mensaje"
            });
        }
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new ChatController();