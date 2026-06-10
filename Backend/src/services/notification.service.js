const prisma = require("../config/prisma");

class NotificationService {
    async create({ roomId, userId, notification_type, title, message }) {
        return prisma.notifications.create({
            data: {
                room_id: roomId ? BigInt(roomId) : null,
                user_id: userId ? BigInt(userId) : null,
                notification_type,
                title,
                message
            }
        });
    }

    async getByRoom(roomId) {
        return prisma.notifications.findMany({
            where: { room_id: BigInt(roomId) },
            orderBy: { created_at: "desc" }
        });
    }

    async getByUser(userId) {
        return prisma.notifications.findMany({
            where: { user_id: BigInt(userId) },
            orderBy: { created_at: "desc" }
        });
    }

    async getUnreadByUser(userId) {
        return prisma.notifications.findMany({
            where: {
                user_id: BigInt(userId),
                is_read: false
            },
            orderBy: { created_at: "desc" }
        });
    }

    async markAsRead(notificationId) {
        return prisma.notifications.update({
            where: { notification_id: BigInt(notificationId) },
            data: { is_read: true }
        });
    }

    async markAllAsReadByUser(userId) {
        return prisma.notifications.updateMany({
            where: {
                user_id: BigInt(userId),
                is_read: false
            },
            data: { is_read: true }
        });
    }
}

module.exports = new NotificationService();