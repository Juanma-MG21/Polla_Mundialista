const teamRatingService = require("../services/teamRating.service");

class TeamRatingController {
    /**
     * @route   POST /api/team-ratings
     * @desc    Registra una nueva métrica / snapshot de rendimiento para un equipo
     */
    async create(req, res) {
        try {
            const { team_id, offensive_rating, defensive_rating, context_rating } = req.body;

            const rating = await teamRatingService.createSnapshot({
                team_id,
                offensive_rating,
                defensive_rating,
                context_rating
            });

            return res.status(201).json({
                success: true,
                message: "Métricas de rendimiento registradas correctamente",
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
     * @route   GET /api/team-ratings/latest/:teamId
     * @desc    Obtiene la última calificación disponible de un equipo específico
     */
    async latest(req, res) {
        try {
            const { teamId } = req.params;
            const rating = await teamRatingService.getLatestRating(teamId);

            if (!rating) {
                return res.status(404).json({
                    success: false,
                    message: "No se encontraron registros de rendimiento para este equipo"
                });
            }

            return res.status(200).json({
                success: true,
                data: rating
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al recuperar la calificación del equipo"
            });
        }
    }

    /**
     * @route   GET /api/team-ratings/history/:teamId
     * @desc    Obtiene el historial completo de evolución de calificaciones de un equipo
     */
    async history(req, res) {
        try {
            const { teamId } = req.params;
            const history = await teamRatingService.getHistory(teamId);

            return res.status(200).json({
                success: true,
                data: history
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al recuperar el historial de rendimiento"
            });
        }
    }
}

module.exports = new TeamRatingController();