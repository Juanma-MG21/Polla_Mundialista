const notificationService = require("../services/notification.service");

class NotificationController {
    async getByRoom(req, res) {
        try {
            const { roomId } = req.params;
            const data = await notificationService.getByRoom(roomId);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getMyNotifications(req, res) {
        try {
            const data = await notificationService.getByUser(req.user.userId);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getUnread(req, res) {
        try {
            const data = await notificationService.getUnreadByUser(req.user.userId);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const data = await notificationService.markAsRead(notificationId);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async markAllAsRead(req, res) {
        try {
            await notificationService.markAllAsReadByUser(req.user.userId);

            return res.status(200).json({ success: true, message: "Notificaciones marcadas como leídas" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new NotificationController();