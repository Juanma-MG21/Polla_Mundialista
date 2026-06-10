const playerService = require("../services/player.service");

class PlayerController {
    async getByTeam(req, res) {
        try {
            const { teamId } = req.params;
            const players = await playerService.getPlayersByTeam(teamId);

            return res.status(200).json({ success: true, data: players });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const { playerId } = req.params;
            const player = await playerService.getPlayer(playerId);

            if (!player) {
                return res.status(404).json({ success: false, message: "Jugador no encontrado" });
            }

            return res.status(200).json({ success: true, data: player });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { first_name, last_name, birth_date, position, team_id } = req.body;

            const player = await playerService.createPlayer({
                first_name,
                last_name,
                birth_date,
                position,
                team_id
            });

            return res.status(201).json({
                success: true,
                message: "Jugador registrado exitosamente",
                data: player
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { playerId } = req.params;
            const { first_name, last_name, birth_date, position, team_id } = req.body;

            const player = await playerService.updatePlayer(playerId, {
                first_name,
                last_name,
                birth_date,
                position,
                team_id
            });

            return res.status(200).json({
                success: true,
                message: "Jugador actualizado exitosamente",
                data: player
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { playerId } = req.params;
            await playerService.deletePlayer(playerId);

            return res.status(200).json({ success: true, message: "Jugador eliminado exitosamente" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new PlayerController();