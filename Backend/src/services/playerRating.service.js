const prisma = require("../config/prisma");

class PlayerRatingService {
    calculateFinalRating(
        offensive,
        form,
        fatigue
    ) {
        return Number(
            (
                Number(offensive) *
                    0.50 +
                Number(form) *
                    0.35 +
                (100 -
                    Number(
                        fatigue
                    )) *
                    0.15
            ).toFixed(2)
        );
    }

    async createSnapshot(
        ratingData
    ) {
        const {
            player_id,
            offensive_rating,
            form_rating,
            fatigue_rating
        } = ratingData;

        if (!player_id) {
            throw new Error(
                "El ID del jugador es obligatorio"
            );
        }

        const finalRating =
            this.calculateFinalRating(
                offensive_rating,
                form_rating,
                fatigue_rating
            );

        return prisma.player_ratings.create(
            {
                data: {
                    player_id:
                        BigInt(
                            player_id
                        ),

                    rating_date:
                        new Date(),

                    fatigue_rating:
                        fatigue_rating,

                    form_rating:
                        form_rating,

                    offensive_rating:
                        offensive_rating,

                    final_rating:
                        finalRating
                }
            }
        );
    }

    async getLatestRating(
        playerId
    ) {
        return prisma.player_ratings.findFirst(
            {
                where: {
                    player_id:
                        BigInt(
                            playerId
                        )
                },

                orderBy: {
                    rating_date:
                        "desc"
                }
            }
        );
    }

    async getHistory(
        playerId
    ) {
        return prisma.player_ratings.findMany(
            {
                where: {
                    player_id:
                        BigInt(
                            playerId
                        )
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
    new PlayerRatingService();