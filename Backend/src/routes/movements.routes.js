const express = require("express");
const router = express.Router();
const movementsController = require("../controllers/movements.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);
router.get("/", movementsController.getAll);

module.exports = router;
