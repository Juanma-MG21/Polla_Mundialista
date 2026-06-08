const pollService = require("../services/poll.service");

class PollController {
    /**
     * @route   POST /api/rooms/:roomId/polls
     * @desc    Crea una nueva encuesta dentro de una sala específica
     */
    async create(req, res) {
        try {
            const { roomId } = req.params;
            const { title, options } = req.body;

            // Validaciones iniciales preventivas
            if (!title || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "El título o pregunta de la encuesta es obligatorio"
                });
            }

            if (!options || !Array.isArray(options) || options.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "La encuesta debe contener un arreglo con mínimo dos opciones"
                });
            }

            const poll = await pollService.createPoll(
                req.user.userId,
                roomId,
                title,
                options
            );

            return res.status(201).json({
                success: true,
                message: "Encuesta creada exitosamente",
                data: poll
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al crear la encuesta"
            });
        }
    }

    /**
     * @route   POST /api/polls/:pollId/vote
     * @desc    Registra el voto de un usuario en una opción de la encuesta
     */
    async vote(req, res) {
        try {
            const { pollId } = req.params;
            const { option_id } = req.body;

            if (!option_id) {
                return res.status(400).json({
                    success: false,
                    message: "El ID de la opción seleccionada es obligatorio"
                });
            }

            const vote = await pollService.vote(
                req.user.userId,
                pollId,
                option_id
            );

            return res.status(200).json({
                success: true,
                message: "Voto registrado exitosamente",
                data: vote
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   PUT /api/polls/:pollId/close
     * @desc    Cierra una encuesta abierta para detener la recepción de votos
     */
    async close(req, res) {
        try {
            const { pollId } = req.params;

            const poll = await pollService.closePoll(pollId);

            return res.status(200).json({
                success: true,
                message: "Encuesta cerrada exitosamente",
                data: poll
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/polls/:pollId
     * @desc    Obtiene los detalles de una encuesta específica con sus opciones
     */
    async getPoll(req, res) {
        try {
            const { pollId } = req.params;

            const poll = await pollService.getPoll(pollId);

            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: "Encuesta no encontrada"
                });
            }

            return res.status(200).json({
                success: true,
                data: poll
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener la encuesta"
            });
        }
    }

    /**
     * @route   GET /api/rooms/:roomId/polls
     * @desc    Obtiene el listado de todas las encuestas creadas en una sala
     */
    async getRoomPolls(req, res) {
        try {
            const { roomId } = req.params;

            const polls = await pollService.getRoomPolls(roomId);

            return res.status(200).json({
                success: true,
                data: polls
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener las encuestas"
            });
        }
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new PollController();