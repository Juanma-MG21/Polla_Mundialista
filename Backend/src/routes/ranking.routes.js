const express = require("express");
const router = express.Router();
const rankingController = require("../controllers/ranking.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/room/:roomId", rankingController.getRoomRanking);
router.get("/room/:roomId/me", rankingController.getUserStats);

module.exports = router;