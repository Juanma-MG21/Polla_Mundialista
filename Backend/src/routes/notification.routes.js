const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/room/:roomId", notificationController.getByRoom);
router.get("/me", notificationController.getMyNotifications);
router.get("/me/unread", notificationController.getUnread);
router.patch("/:notificationId/read", notificationController.markAsRead);
router.patch("/me/read-all", notificationController.markAllAsRead);

module.exports = router;