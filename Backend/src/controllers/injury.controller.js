const injuryService = require("../services/injury.service");

class InjuryController {
    /**
     * @route   GET /api/injuries/team/:teamId
     * @desc    Obtiene el listado de lesiones activas de un equipo
     */
    async getActive(req, res) {
        try {
            const { teamId } = req.params;
            const injuries = await injuryService.getActiveInjuries(teamId);

            return res.status(200).json({
                success: true,
                data: injuries
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener las lesiones activas"
            });
        }
    }

    /**
     * @route   POST /api/injuries
     * @desc    Registra un nuevo reporte de lesión para un jugador
     */
    async create(req, res) {
        try {
            const { player_id, team_id, injury_type, injury_date } = req.body;

            const injury = await injuryService.createInjury({
                player_id,
                team_id,
                injury_type,
                injury_date
            });

            return res.status(201).json({
                success: true,
                message: "Reporte de lesión creado exitosamente",
                data: injury
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   PUT /api/injuries/:injuryId/resolve
     * @desc    Registra la recuperación/alta médica de un jugador lesionado
     */
    async resolve(req, res) {
        try {
            const { injuryId } = req.params;
            const updatedInjury = await injuryService.resolveInjury(injuryId);

            return res.status(200).json({
                success: true,
                message: "Alta médica registrada exitosamente",
                data: updatedInjury
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new InjuryController();