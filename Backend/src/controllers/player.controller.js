const playerService = require("../services/player.service");

class PlayerController {
    /**
     * @route   GET /api/players/team/:teamId
     * @desc    Obtiene todos los jugadores pertenecientes a un equipo específico
     */
    async getByTeam(req, res) {
        try {
            const { teamId } = req.params;
            const players = await playerService.getPlayersByTeam(teamId);

            return res.status(200).json({
                success: true,
                data: players
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener los jugadores del equipo"
            });
        }
    }

    /**
     * @route   GET /api/players/:playerId
     * @desc    Obtiene los detalles de un jugador específico por su ID
     */
    async getOne(req, res) {
        try {
            const { playerId } = req.params;
            const player = await playerService.getPlayer(playerId);

            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: "Jugador no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: player
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener el jugador"
            });
        }
    }

    /**
     * @route   POST /api/players
     * @desc    Registra un nuevo jugador y lo asigna a un equipo
     */
    async create(req, res) {
        try {
            const { player_name, team_id, jersey_number } = req.body;

            // Validaciones iniciales en la capa del controlador
            if (!player_name || !player_name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre del jugador es obligatorio"
                });
            }

            if (!team_id) {
                return res.status(400).json({
                    success: false,
                    message: "El ID del equipo es obligatorio"
                });
            }

            const player = await playerService.createPlayer({
                player_name,
                team_id,
                jersey_number
            });

            return res.status(201).json({
                success: true,
                message: "Jugador registrado exitosamente",
                data: player
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   PUT /api/players/:playerId
     * @desc    Actualiza los detalles de un jugador existente
     */
    async update(req, res) {
        try {
            const { playerId } = req.params;
            const { player_name, team_id, jersey_number } = req.body;

            const player = await playerService.updatePlayer(playerId, {
                player_name,
                team_id,
                jersey_number
            });

            return res.status(200).json({
                success: true,
                message: "Jugador actualizado exitosamente",
                data: player
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/players/:playerId
     * @desc    Elimina un jugador por su ID
     */
    async delete(req, res) {
        try {
            const { playerId } = req.params;

            await playerService.deletePlayer(playerId);

            return res.status(200).json({
                success: true,
                message: "Jugador eliminado exitosamente"
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
module.exports = new PlayerController();