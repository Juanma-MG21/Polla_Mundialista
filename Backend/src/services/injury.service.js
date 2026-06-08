const prisma = require("../config/prisma");

class InjuryService {
    /**
     * Obtiene todas las lesiones activas de un equipo específico.
     * @param {number|string} teamId - ID del equipo.
     */
    async getActiveInjuries(teamId) {
        return await prisma.injuries.findMany({
            where: {
                team_id: Number(teamId),
                is_active: true
            },
            include: {
                players: true // Incluye los datos del jugador lesionado (nombre, camiseta, etc.)
            },
            orderBy: {
                injury_date: "desc" // Las más recientes primero
            }
        });
    }

    /**
     * Registra una nueva lesión para un jugador.
     * @param {Object} injuryData - Datos del reporte de lesión.
     */
    async createInjury(injuryData) {
        if (!injuryData.player_id) throw new Error("El ID del jugador es obligatorio");
        if (!injuryData.team_id) throw new Error("El ID del equipo es obligatorio");
        if (!injuryData.injury_type || !injuryData.injury_type.trim()) {
            throw new Error("El tipo o descripción de la lesión es obligatorio");
        }

        return await prisma.injuries.create({
            data: {
                player_id: Number(injuryData.player_id),
                team_id: Number(injuryData.team_id),
                injury_type: injuryData.injury_type.trim(),
                injury_date: injuryData.injury_date ? new Date(injuryData.injury_date) : new Date(),
                is_active: true
            }
        });
    }

    /**
     * Registra el alta médica de un jugador cerrando el reporte de lesión.
     * @param {number|string} injuryId - ID de la lesión.
     */
    async resolveInjury(injuryId) {
        const injury = await prisma.injuries.findUnique({
            where: { injury_id: Number(injuryId) }
        });

        if (!injury) {
            throw new Error("Reporte de lesión no encontrado");
        }

        return await prisma.injuries.update({
            where: { injury_id: Number(injuryId) },
            data: {
                is_active: false,
                recovery_date: new Date() // Guarda el momento exacto del alta médica
            }
        });
    }
}

module.exports = new InjuryService();