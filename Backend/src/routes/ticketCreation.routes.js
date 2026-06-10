const express = require("express");
const router = express.Router();
const ticketCreationController = require("../controllers/ticketCreation.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/room/:roomId", ticketCreationController.create);
router.post("/room/:roomId/validate", ticketCreationController.validate);
router.get("/room/:roomId", ticketCreationController.getByRoom);
router.get("/me", ticketCreationController.getMyTickets);
router.get("/:ticketId", ticketCreationController.getById);
router.patch("/:ticketId/lock", ticketCreationController.lock);

module.exports = router;