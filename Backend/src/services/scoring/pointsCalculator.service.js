class PointsCalculatorService {

    calculateBasePoints(
        probability
    ) {

        const normalizedProbability =
            Number(probability);

        if (
            Number.isNaN(
                normalizedProbability
            )
        ) {

            throw new Error(
                "Invalid probability"
            );
        }

        if (
            normalizedProbability < 0 ||
            normalizedProbability > 100
        ) {

            throw new Error(
                "Probability must be between 0 and 100"
            );
        }

        const points =
            Math.round(

                1000 *
                (
                    1 -
                    (
                        normalizedProbability /
                        100
                    )
                )
            );

        return points;
    }
}

module.exports =
    new PointsCalculatorService();