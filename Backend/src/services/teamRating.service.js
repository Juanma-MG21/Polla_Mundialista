const prisma = require("../config/prisma");

class TeamRatingService {
    /**
     * Calcula la calificación global promediando de manera ponderada los atributos.
     * Ponderaciones: Ofensivo (35%), Defensivo (35%), Contexto (30%).
     */
    calculateGlobalRating(offensive, defensive, context) {
        return Number(
            (
                Number(offensive) * 0.35 +
                Number(defensive) * 0.35 +
                Number(context) * 0.30
            ).toFixed(2)
        );
    }

    /**
     * Registra un nuevo snapshot histórico de rendimiento para un equipo.
     * @param {Object} ratingData - Atributos de calificación del equipo.
     */
    async createSnapshot(ratingData) {
        const { team_id, offensive_rating, defensive_rating, context_rating } = ratingData;

        if (!team_id) throw new Error("El ID del equipo es obligatorio");
        if (offensive_rating === undefined || defensive_rating === undefined || context_rating === undefined) {
            throw new Error("Todas las métricas de rendimiento son obligatorias");
        }

        const globalRating = this.calculateGlobalRating(
            offensive_rating,
            defensive_rating,
            context_rating
        );

        return await prisma.team_ratings.create({
            data: {
                team_id: Number(team_id),
                offensive_rating: Number(offensive_rating),
                defensive_rating: Number(defensive_rating),
                context_rating: Number(context_rating),
                global_rating: globalRating,
                snapshot_date: new Date()
            }
        });
    }

    /**
     * Obtiene el snapshot de calificación más reciente de un equipo.
     * @param {number|string} teamId - ID del equipo.
     */
    async getLatestRating(teamId) {
        return await prisma.team_ratings.findFirst({
            where: {
                team_id: Number(teamId)
            },
            orderBy: {
                snapshot_date: "desc"
            }
        });
    }

    /**
     * Obtiene todo el historial cronológico de rendimiento y evolución del equipo.
     * @param {number|string} teamId - ID del equipo.
     */
    async getHistory(teamId) {
        return await prisma.team_ratings.findMany({
            where: {
                team_id: Number(teamId)
            },
            orderBy: {
                snapshot_date: "desc" // De la más reciente a la más antigua
            }
        });
    }
}

module.exports = new TeamRatingService();