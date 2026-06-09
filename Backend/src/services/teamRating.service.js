const prisma = require("../config/prisma");

class TeamRatingService {
    calculateFinalRating(
        offensive,
        defensive,
        contextual
    ) {
        return Number(
            (
                Number(offensive) *
                    0.35 +
                Number(defensive) *
                    0.35 +
                Number(contextual) *
                    0.30
            ).toFixed(2)
        );
    }

    async createSnapshot(
        ratingData
    ) {
        const {
            team_id,
            offensive_rating,
            defensive_rating,
            contextual_rating
        } = ratingData;

        if (!team_id) {
            throw new Error(
                "El ID del equipo es obligatorio"
            );
        }

        const finalRating =
            this.calculateFinalRating(
                offensive_rating,
                defensive_rating,
                contextual_rating
            );

        return prisma.team_ratings.create(
            {
                data: {
                    team_id:
                        BigInt(team_id),

                    rating_date:
                        new Date(),

                    offensive_rating:
                        offensive_rating,

                    defensive_rating:
                        defensive_rating,

                    contextual_rating:
                        contextual_rating,

                    final_rating:
                        finalRating
                }
            }
        );
    }

    async getLatestRating(
        teamId
    ) {
        return prisma.team_ratings.findFirst(
            {
                where: {
                    team_id:
                        BigInt(teamId)
                },

                orderBy: {
                    rating_date:
                        "desc"
                }
            }
        );
    }

    async getHistory(
        teamId
    ) {
        return prisma.team_ratings.findMany(
            {
                where: {
                    team_id:
                        BigInt(teamId)
                },

                orderBy: {
                    rating_date:
                        "desc"
                }
            }
        );
    }
}

module.exports =
    new TeamRatingService();