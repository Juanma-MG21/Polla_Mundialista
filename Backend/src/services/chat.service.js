const prisma = require("../config/prisma");

class ChatService {
    /**
     * Envía un mensaje de chat dentro de una sala, validando la membresía del usuario.
     * @param {number} roomId - ID de la sala.
     * @param {number} userId - ID del usuario que envía el mensaje.
     * @param {string} messageText - Contenido del mensaje.
     */
    async sendMessage(roomId, userId, messageText) {
        if (!messageText || !messageText.trim()) {
            throw new Error("El mensaje no puede estar vacío");
        }

        // Verificar si el usuario realmente pertenece a la sala antes de permitirle hablar
        const member = await prisma.room_members.findFirst({
            where: {
                room_id: Number(roomId),
                user_id: Number(userId)
            }
        });

        if (!member) {
            throw new Error("No perteneces a esta sala");
        }

        return await prisma.chat_messages.create({
            data: {
                room_id: Number(roomId),
                user_id: Number(userId),
                message_text: messageText.trim()
            },
            include: {
                users: true // Devuelve los datos del autor de inmediato (útil para WebSockets)
            }
        });
    }

    /**
     * Obtiene los últimos mensajes de una sala ordenados cronológicamente para el chat feed.
     * @param {number} roomId - ID de la sala.
     * @param {number} limit - Cantidad máxima de mensajes a recuperar.
     */
    async getMessages(roomId, limit = 50) {
        const messages = await prisma.chat_messages.findMany({
            where: {
                room_id: Number(roomId)
            },
            include: {
                users: true // Incluye datos del usuario (nombre/username) para pintarlo en el chat
            },
            orderBy: {
                created_at: "desc" // Trae los más recientes primero para aplicar el límite (take)
            },
            take: Number(limit)
        });

        // Invertimos el arreglo para que al Frontend le lleguen en orden cronológico correcto (antiguos -> nuevos)
        return messages.reverse();
    }

    /**
     * Obtiene los detalles de un mensaje individual por su ID único.
     */
    async getMessage(messageId) {
        return await prisma.chat_messages.findUnique({
            where: {
                message_id: Number(messageId)
            },
            include: {
                users: true
            }
        });
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new ChatService();