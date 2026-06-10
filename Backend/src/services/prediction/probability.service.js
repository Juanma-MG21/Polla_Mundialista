class ProbabilityService {
    normalize(value) {
        return Math.max(
            0,
            Math.min(
                100,
                Number(value)
            )
        );
    }

    calculate(
        homeIndexes,
        awayIndexes
    ) {
        const homeScore =
            homeIndexes.historical *
                0.20 +
            homeIndexes.recentForm *
                0.25 +
            homeIndexes
                .opponentStrength *
                0.15 +
            homeIndexes.momentum *
                0.15 +
            homeIndexes
                .squadStability *
                0.15 +
            homeIndexes.context *
                0.10;

        const awayScore =
            awayIndexes.historical *
                0.20 +
            awayIndexes.recentForm *
                0.25 +
            awayIndexes
                .opponentStrength *
                0.15 +
            awayIndexes.momentum *
                0.15 +
            awayIndexes
                .squadStability *
                0.15 +
            awayIndexes.context *
                0.10;

        const total =
            homeScore + awayScore;

        if (total <= 0) {
            return {
                homeScore: 50,
                awayScore: 50,
                probabilities: {
                    homeWin: 33.33,
                    draw: 33.34,
                    awayWin: 33.33
                }
            };
        }

        const homeBase =
            (homeScore / total) *
            100;

        const awayBase =
            (awayScore / total) *
            100;

        const difference =
            Math.abs(
                homeBase -
                    awayBase
            );

        let draw =
            30 -
            difference * 0.4;

        draw = Math.max(
            10,
            Math.min(
                30,
                draw
            )
        );

        let remaining =
            100 - draw;

        let homeWin =
            (homeBase /
                (homeBase +
                    awayBase)) *
            remaining;

        let awayWin =
            (awayBase /
                (homeBase +
                    awayBase)) *
            remaining;

        const adjustment =
            100 /
            (
                homeWin +
                draw +
                awayWin
            );

        homeWin *= adjustment;
        awayWin *= adjustment;
        draw *= adjustment;

        return {
            homeScore: Number(
                homeScore.toFixed(2)
            ),

            awayScore: Number(
                awayScore.toFixed(2)
            ),

            probabilities: {
                homeWin: Number(
                    this.normalize(
                        homeWin
                    ).toFixed(2)
                ),

                draw: Number(
                    this.normalize(
                        draw
                    ).toFixed(2)
                ),

                awayWin: Number(
                    this.normalize(
                        awayWin
                    ).toFixed(2)
                )
            }
        };
    }
}

module.exports =
    new ProbabilityService();