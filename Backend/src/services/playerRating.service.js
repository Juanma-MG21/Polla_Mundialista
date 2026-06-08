const prisma = require("../config/prisma");

class PlayerRatingService {
    /**
     * Calcula la calificación global del jugador promediando de forma ponderada.
     * Ponderaciones: Ataque (40%), Defensa (25%), Estado de Forma (35%).
     */
    calculateGlobal(attack, defense, form) {
        return Number(
            (
                Number(attack) * 0.40 +
                Number(defense) * 0.25 +
                Number(form) * 0.35
            ).toFixed(2)
        );
    }

    /**
     * Registra un nuevo snapshot histórico de rendimiento para un jugador.
     * @param {Object} ratingData - Atributos de calificación enviados por el cliente.
     */
    async createSnapshot(ratingData) {
        const { player_id, attack_rating, defense_rating, form_rating } = ratingData;

        if (!player_id) throw new Error("El ID del jugador es obligatorio");
        if (attack_rating === undefined || defense_rating === undefined || form_rating === undefined) {
            throw new Error("Todas las métricas de rendimiento (ataque, defensa y forma) son obligatorias");
        }

        const globalRating = this.calculateGlobal(
            attack_rating,
            defense_rating,
            form_rating
        );

        return await prisma.player_ratings.create({
            data: {
                player_id: Number(player_id),
                attack_rating: Number(attack_rating),
                defense_rating: Number(defense_rating),
                form_rating: Number(form_rating),
                global_rating: globalRating,
                snapshot_date: new Date()
            }
        });
    }

    /**
     * Obtiene el último snapshot de rendimiento vigente de un jugador.
     * @param {number|string} playerId - ID del jugador.
     */
    async getLatestRating(playerId) {
        return await prisma.player_ratings.findFirst({
            where: {
                player_id: Number(playerId)
            },
            orderBy: {
                snapshot_date: "desc"
            }
        });
    }

    /**
     * Obtiene la serie de tiempo analítica con toda la evolución del jugador.
     * @param {number|string} playerId - ID del jugador.
     */
    async getHistory(playerId) {
        return await prisma.player_ratings.findMany({
            where: {
                player_id: Number(playerId)
            },
            orderBy: {
                snapshot_date: "desc" // De más reciente a más antiguo para gráficos en el Frontend
            }
        });
    }
}

module.exports = new PlayerRatingService();