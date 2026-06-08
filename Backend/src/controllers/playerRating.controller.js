const playerRatingService = require("../services/playerRating.service");

class PlayerRatingController {
    /**
     * @route   POST /api/player-ratings
     * @desc    Registra una nueva evaluación/snapshot de rendimiento para un jugador
     */
    async create(req, res) {
        try {
            const { player_id, attack_rating, defense_rating, form_rating } = req.body;

            const rating = await playerRatingService.createSnapshot({
                player_id,
                attack_rating,
                defense_rating,
                form_rating
            });

            return res.status(201).json({
                success: true,
                message: "Métricas de rendimiento del jugador registradas exitosamente",
                data: rating
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/player-ratings/latest/:playerId
     * @desc    Obtiene la calificación actual y más reciente de un jugador
     */
    async latest(req, res) {
        try {
            const { playerId } = req.params;
            const rating = await playerRatingService.getLatestRating(playerId);

            if (!rating) {
                return res.status(404).json({
                    success: false,
                    message: "No se encontraron registros de rendimiento para este jugador"
                });
            }

            return res.status(200).json({
                success: true,
                data: rating
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al recuperar la calificación del jugador"
            });
        }
    }

    /**
     * @route   GET /api/player-ratings/history/:playerId
     * @desc    Obtiene el historial completo de rendimiento para análisis evolutivo
     */
    async history(req, res) {
        try {
            const { playerId } = req.params;
            const history = await playerRatingService.getHistory(playerId);

            return res.status(200).json({
                success: true,
                data: history
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al recuperar el historial analítico del jugador"
            });
        }
    }
}

module.exports = new PlayerRatingController();