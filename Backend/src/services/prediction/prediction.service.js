const prisma = require("../../config/prisma");

const historicalService =
    require("./historical.service");

const recentFormService =
    require("./recentForm.service");

const opponentStrengthService =
    require("./opponentStrength.service");

const momentumService =
    require("./momentum.service");

const squadStabilityService =
    require("./squadStability.service");

const contextService =
    require("./context.service");

const probabilityService =
    require("./probability.service");

class PredictionService {
    async generatePrediction(matchId) {
        const match =
            await prisma.matches.findUnique({
                where: {
                    match_id: Number(matchId)
                }
            });

        if (!match) {
            throw new Error(
                "Partido no encontrado"
            );
        }

        const homeTeamId =
            match.home_team_id;

        const awayTeamId =
            match.away_team_id;

        const [
            homeHistorical,
            awayHistorical,

            homeRecentForm,
            awayRecentForm,

            homeOpponentStrength,
            awayOpponentStrength,

            homeMomentum,
            awayMomentum,

            homeSquadStability,
            awaySquadStability,

            contextScore
        ] = await Promise.all([
            historicalService.calculate(
                homeTeamId
            ),

            historicalService.calculate(
                awayTeamId
            ),

            recentFormService.calculate(
                homeTeamId
            ),

            recentFormService.calculate(
                awayTeamId
            ),

            opponentStrengthService.calculate(
                homeTeamId
            ),

            opponentStrengthService.calculate(
                awayTeamId
            ),

            momentumService.calculate(
                homeTeamId
            ),

            momentumService.calculate(
                awayTeamId
            ),

            squadStabilityService.calculate(
                homeTeamId
            ),

            squadStabilityService.calculate(
                awayTeamId
            ),

            contextService.calculate(
                matchId
            )
        ]);

        const homeIndexes = {
            historical:
                homeHistorical,

            recentForm:
                homeRecentForm,

            opponentStrength:
                homeOpponentStrength,

            momentum:
                homeMomentum,

            squadStability:
                homeSquadStability,

            context:
                contextScore
        };

        const awayIndexes = {
            historical:
                awayHistorical,

            recentForm:
                awayRecentForm,

            opponentStrength:
                awayOpponentStrength,

            momentum:
                awayMomentum,

            squadStability:
                awaySquadStability,

            context:
                100 - contextScore
        };

        const result =
            probabilityService.calculate(
                homeIndexes,
                awayIndexes
            );

        return {
            matchId,

            generatedAt:
                new Date(),

            indexes: {
                home: homeIndexes,
                away: awayIndexes
            },

            scores: {
                home:
                    result.homeScore,

                away:
                    result.awayScore
            },

            probabilities:
                result.probabilities,

            prediction:
                result.probabilities
                    .homeWin >
                result.probabilities
                    .awayWin
                    ? "HOME_WIN"
                    : result.probabilities
                          .awayWin >
                      result.probabilities
                          .homeWin
                    ? "AWAY_WIN"
                    : "DRAW"
        };
    }
}

module.exports =
    new PredictionService();