const prisma = require("../config/prisma");

class ChatService {
    async sendMessage(roomId, userId, messageText) {
        if (!messageText?.trim()) {
            throw new Error("El mensaje no puede estar vacío");
        }

        const member = await prisma.room_members.findFirst({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId)
            }
        });

        if (!member) {
            throw new Error("No perteneces a esta sala");
        }

        return prisma.chat_messages.create({
            data: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId),
                message_text: messageText.trim()
            },
            include: { users: true }
        });
    }

    async getMessages(roomId, limit = 50) {
        const messages = await prisma.chat_messages.findMany({
            where: { room_id: BigInt(roomId) },
            include: { users: true },
            orderBy: { created_at: "desc" },
            take: Number(limit)
        });

        return messages.reverse();
    }

    async getMessage(messageId) {
        return prisma.chat_messages.findUnique({
            where: { message_id: BigInt(messageId) },
            include: { users: true }
        });
    }
}

module.exports = new ChatService();