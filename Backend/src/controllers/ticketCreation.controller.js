const ticketCreationService = require("../services/ticket/ticketCreation.service");
const ticketValidationService = require("../services/ticket/ticketValidation.service");
const ticketQueryService = require("../services/ticket/ticketQuery.service");
const ticketLockService = require("../services/ticket/ticketLock.service");

class TicketCreationController {
    async create(req, res) {
        try {
            const { roomId } = req.params;
            const { selections } = req.body;

            const ticket = await ticketCreationService.createTicket(
                req.user.userId,
                roomId,
                selections
            );

            return res.status(201).json({ success: true, data: ticket });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async validate(req, res) {
        try {
            const { roomId } = req.params;
            const { selections } = req.body;

            const result = await ticketValidationService.validate(
                req.user.userId,
                roomId,
                selections
            );

            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getByRoom(req, res) {
        try {
            const { roomId } = req.params;
            const data = await ticketQueryService.getByRoom(roomId);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getMyTickets(req, res) {
        try {
            const data = await ticketQueryService.getByUser(req.user.userId);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { ticketId } = req.params;
            const data = await ticketQueryService.getById(ticketId);

            if (!data) return res.status(404).json({ success: false, message: "Ticket no encontrado" });

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async lock(req, res) {
        try {
            const { ticketId } = req.params;
            const data = await ticketLockService.lockTicket(ticketId);

            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new TicketCreationController();