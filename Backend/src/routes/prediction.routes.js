const express = require("express");

const router = express.Router();

const predictionController = require(
    "../controllers/prediction.controller"
);

router.get(
    "/:matchId",
    predictionController.generatePrediction
);

module.exports = router;