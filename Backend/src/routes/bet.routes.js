const express = require("express");
const router = express.Router();
const betController = require("../controllers/bet.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);
router.get("/history", betController.getHistory);

module.exports = router;
