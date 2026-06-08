const teamService = require("../services/team.service");

class TeamController {
    /**
     * @route   GET /api/teams
     * @desc    Obtiene el listado de todos los equipos
     */
    async getAll(req, res) {
        try {
            const teams = await teamService.getAllTeams();

            return res.status(200).json({
                success: true,
                data: teams
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener los equipos"
            });
        }
    }

    /**
     * @route   GET /api/teams/:teamId
     * @desc    Obtiene los detalles de un equipo específico por su ID
     */
    async getOne(req, res) {
        try {
            const { teamId } = req.params;
            const team = await teamService.getTeam(teamId);

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "Equipo no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: team
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener el equipo"
            });
        }
    }

    /**
     * @route   POST /api/teams
     * @desc    Registra un nuevo equipo
     */
    async create(req, res) {
        try {
            const { team_name } = req.body;

            if (!team_name || !team_name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre del equipo es obligatorio"
                });
            }

            const team = await teamService.createTeam({ team_name });

            return res.status(201).json({
                success: true,
                message: "Equipo creado exitosamente",
                data: team
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   PUT /api/teams/:teamId
     * @desc    Actualiza el nombre de un equipo existente
     */
    async update(req, res) {
        try {
            const { teamId } = req.params;
            const { team_name } = req.body;

            if (!team_name || !team_name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre del equipo no puede estar vacío"
                });
            }

            const team = await teamService.updateTeam(teamId, { team_name });

            return res.status(200).json({
                success: true,
                message: "Equipo actualizado exitosamente",
                data: team
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/teams/:teamId
     * @desc    Elimina un equipo por su ID
     */
    async delete(req, res) {
        try {
            const { teamId } = req.params;

            await teamService.deleteTeam(teamId);

            return res.status(200).json({
                success: true,
                message: "Equipo eliminado exitosamente"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new TeamController();