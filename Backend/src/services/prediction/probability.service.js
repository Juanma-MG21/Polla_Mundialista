class ProbabilityService {
    normalize(value) {
        return Math.max(
            0,
            Math.min(100, Number(value))
        );
    }

    calculate(homeIndexes, awayIndexes) {
        const homeScore =
            homeIndexes.historical * 0.20 +
            homeIndexes.recentForm * 0.25 +
            homeIndexes.opponentStrength * 0.15 +
            homeIndexes.momentum * 0.15 +
            homeIndexes.squadStability * 0.15 +
            homeIndexes.context * 0.10;

        const awayScore =
            awayIndexes.historical * 0.20 +
            awayIndexes.recentForm * 0.25 +
            awayIndexes.opponentStrength * 0.15 +
            awayIndexes.momentum * 0.15 +
            awayIndexes.squadStability * 0.15 +
            awayIndexes.context * 0.10;

        const difference =
            homeScore - awayScore;

        let homeWin;
        let draw;
        let awayWin;

        if (Math.abs(difference) <= 5) {
            homeWin = 35;
            draw = 30;
            awayWin = 35;
        }
        else if (difference > 0) {
            homeWin =
                Math.min(
                    75,
                    50 + difference * 0.8
                );

            awayWin =
                Math.max(
                    10,
                    40 - difference * 0.6
                );

            draw =
                100 -
                homeWin -
                awayWin;
        }
        else {
            const absDiff =
                Math.abs(difference);

            awayWin =
                Math.min(
                    75,
                    50 + absDiff * 0.8
                );

            homeWin =
                Math.max(
                    10,
                    40 - absDiff * 0.6
                );

            draw =
                100 -
                homeWin -
                awayWin;
        }

        return {
            homeScore:
                Number(
                    homeScore.toFixed(2)
                ),

            awayScore:
                Number(
                    awayScore.toFixed(2)
                ),

            probabilities: {
                homeWin:
                    Number(
                        this.normalize(homeWin)
                            .toFixed(2)
                    ),

                draw:
                    Number(
                        this.normalize(draw)
                            .toFixed(2)
                    ),

                awayWin:
                    Number(
                        this.normalize(awayWin)
                            .toFixed(2)
                    )
            }
        };
    }
}

module.exports =
    new ProbabilityService();