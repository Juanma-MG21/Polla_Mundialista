const ticketService = require("../services/ticket.service");

class TicketController {
    async create(req, res) {
        try {
            const { roomId } = req.params;

            const ticket = await ticketService.create(roomId, req.user.userId);

            return res.status(201).json({ success: true, data: ticket });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getByRoom(req, res) {
        try {
            const { roomId } = req.params;

            const tickets = await ticketService.getByRoom(roomId);

            return res.status(200).json({ success: true, data: tickets });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getByUser(req, res) {
        try {
            const tickets = await ticketService.getByUser(req.user.userId);

            return res.status(200).json({ success: true, data: tickets });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { ticketId } = req.params;

            const ticket = await ticketService.getById(ticketId);

            if (!ticket) {
                return res.status(404).json({ success: false, message: "Ticket no encontrado" });
            }

            return res.status(200).json({ success: true, data: ticket });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async close(req, res) {
        try {
            const { ticketId } = req.params;

            const ticket = await ticketService.close(ticketId);

            return res.status(200).json({ success: true, data: ticket });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new TicketController();