const matchService = require("../services/match.service");

class MatchController {
    /**
     * @route   POST /api/matches
     * @desc    Crea y agenda un nuevo partido
     */
    async create(req, res) {
        try {
            const { home_team_id, away_team_id, kickoff_at, venue, competition } = req.body;

            const match = await matchService.createMatch({
                home_team_id,
                away_team_id,
                kickoff_at,
                venue,
                competition
            });

            return res.status(201).json({
                success: true,
                message: "Partido programado exitosamente",
                data: match
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/matches/:matchId
     * @desc    Obtiene un partido específico por su ID con sus respectivos equipos
     */
    async getOne(req, res) {
        try {
            const { matchId } = req.params;
            const match = await matchService.getMatch(matchId);

            if (!match) {
                return res.status(404).json({
                    success: false,
                    message: "Partido no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: match
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener el partido"
            });
        }
    }

    /**
     * @route   GET /api/matches
     * @desc    Obtiene el listado completo de todos los partidos
     */
    async getAll(req, res) {
        try {
            const matches = await matchService.getAllMatches();

            return res.status(200).json({
                success: true,
                data: matches
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener el historial de partidos"
            });
        }
    }

    /**
     * @route   GET /api/matches/upcoming
     * @desc    Obtiene los próximos partidos agendados
     */
    async getUpcoming(req, res) {
        try {
            const matches = await matchService.getUpcomingMatches();

            return res.status(200).json({
                success: true,
                data: matches
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener los próximos partidos"
            });
        }
    }

    /**
     * @route   PUT /api/matches/:matchId/score
     * @desc    Actualiza el resultado de goles del partido
     */
    async updateScore(req, res) {
        try {
            const { matchId } = req.params;
            const { home_score, away_score } = req.body;

            const match = await matchService.updateScore(matchId, home_score, away_score);

            return res.status(200).json({
                success: true,
                message: "Marcador actualizado correctamente",
                data: match
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   PUT /api/matches/:matchId/status
     * @desc    Modifica el estado regulatorio del partido
     */
    async updateStatus(req, res) {
        try {
            const { matchId } = req.params;
            const { status } = req.body;

            const match = await matchService.updateStatus(matchId, status);

            return res.status(200).json({
                success: true,
                message: "Estado del partido actualizado de forma exitosa",
                data: match
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/matches/head-to-head/:teamA/:teamB
     * @desc    Obtiene el historial de partidos jugados entre dos equipos específicos
     */
    async getHeadToHead(req, res) {
        try {
            const { teamA, teamB } = req.params;
            const matches = await matchService.getHeadToHead(teamA, teamB);

            return res.status(200).json({
                success: true,
                data: matches
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al procesar el Head-to-Head"
            });
        }
    }
}

module.exports = new MatchController();