const prisma = require("../config/prisma");

class PlayerService {
    /**
     * Obtiene todos los jugadores pertenecientes a un equipo específico.
     * @param {number|string} teamId - ID del equipo.
     */
    async getPlayersByTeam(teamId) {
        return await prisma.players.findMany({
            where: {
                team_id: Number(teamId)
            },
            orderBy: {
                player_name: "asc" // Los ordena alfabéticamente para facilitar la lectura
            }
        });
    }

    /**
     * Obtiene los detalles de un jugador específico por su ID único.
     * @param {number|string} playerId - ID del jugador.
     */
    async getPlayer(playerId) {
        return await prisma.players.findUnique({
            where: {
                player_id: Number(playerId)
            },
            include: {
                teams: true // Incluye de forma preventiva los datos del equipo al que pertenece
            }
        });
    }

    /**
     * Registra un nuevo jugador en la base de datos asignándolo a un equipo.
     * @param {Object} playerData - Objeto con los datos del jugador.
     * @param {string} playerData.player_name - Nombre del jugador.
     * @param {number|string} playerData.team_id - ID del equipo al que se unirá.
     * @param {number} [playerData.jersey_number] - Número de camiseta (opcional).
     */
    async createPlayer(playerData) {
        if (!playerData.player_name || !playerData.player_name.trim()) {
            throw new Error("El nombre del jugador es obligatorio");
        }
        if (!playerData.team_id) {
            throw new Error("El ID del equipo es obligatorio");
        }

        return await prisma.players.create({
            data: {
                player_name: playerData.player_name.trim(),
                team_id: Number(playerData.team_id),
                jersey_number: playerData.jersey_number ? Number(playerData.jersey_number) : undefined
            }
        });
    }

    /**
     * Modifica los datos de un jugador existente.
     * @param {number|string} playerId - ID del jugador a editar.
     * @param {Object} playerData - Objeto con los nuevos datos.
     */
    async updatePlayer(playerId, playerData) {
        // Verificar si el jugador existe antes de intentar actualizarlo
        const playerExists = await this.getPlayer(playerId);
        if (!playerExists) {
            throw new Error("Jugador no encontrado");
        }

        // Construimos el objeto de actualización de forma limpia y segura
        const updateData = {};
        
        if (playerData.player_name !== undefined) {
            if (!playerData.player_name.trim()) throw new Error("El nombre no puede estar vacío");
            updateData.player_name = playerData.player_name.trim();
        }
        
        if (playerData.team_id !== undefined) {
            updateData.team_id = Number(playerData.team_id);
        }

        if (playerData.jersey_number !== undefined) {
            updateData.jersey_number = Number(playerData.jersey_number);
        }

        return await prisma.players.update({
            where: {
                player_id: Number(playerId)
            },
            data: updateData
        });
    }

    /**
     * Elimina un jugador de la base de datos por su ID.
     * @param {number|string} playerId - ID del jugador a eliminar.
     */
    async deletePlayer(playerId) {
        const playerExists = await this.getPlayer(playerId);
        if (!playerExists) {
            throw new Error("Jugador no encontrado");
        }

        return await prisma.players.delete({
            where: {
                player_id: Number(playerId)
            }
        });
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new PlayerService();