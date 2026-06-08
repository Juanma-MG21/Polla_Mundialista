const prisma = require("../config/prisma");

class TeamService {
    /**
     * Obtiene todos los equipos registrados ordenados alfabéticamente.
     * @returns {Promise<Array>} Lista de equipos.
     */
    async getAllTeams() {
        return await prisma.teams.findMany({
            orderBy: {
                team_name: "asc"
            }
        });
    }

    /**
     * Obtiene los detalles de un equipo específico por su ID único.
     * @param {number|string} teamId - ID del equipo.
     */
    async getTeam(teamId) {
        return await prisma.teams.findUnique({
            where: {
                team_id: Number(teamId)
            }
        });
    }

    /**
     * Registra un nuevo equipo en la base de datos.
     * @param {Object} teamData - Objeto con los datos del equipo.
     * @param {string} teamData.team_name - Nombre del equipo.
     */
    async createTeam(teamData) {
        if (!teamData.team_name || !teamData.team_name.trim()) {
            throw new Error("El nombre del equipo es obligatorio");
        }

        return await prisma.teams.create({
            data: {
                team_name: teamData.team_name.trim()
            }
        });
    }

    /**
     * Modifica los datos de un equipo existente.
     * @param {number|string} teamId - ID del equipo a editar.
     * @param {Object} teamData - Objeto con los nuevos datos.
     * @param {string} teamData.team_name - Nuevo nombre del equipo.
     */
    async updateTeam(teamId, teamData) {
        if (!teamData.team_name || !teamData.team_name.trim()) {
            throw new Error("El nombre del equipo no puede estar vacío");
        }

        // Verificar si el equipo existe antes de intentar actualizarlo
        const teamExists = await this.getTeam(teamId);
        if (!teamExists) {
            throw new Error("Equipo no encontrado");
        }

        return await prisma.teams.update({
            where: {
                team_id: Number(teamId)
            },
            data: {
                team_name: teamData.team_name.trim()
            }
        });
    }

    /**
     * Elimina un equipo de la base de datos por su ID.
     * @param {number|string} teamId - ID del equipo a eliminar.
     */
    async deleteTeam(teamId) {
        const teamExists = await this.getTeam(teamId);
        if (!teamExists) {
            throw new Error("Equipo no encontrado");
        }

        return await prisma.teams.delete({
            where: {
                team_id: Number(teamId)
            }
        });
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new TeamService();