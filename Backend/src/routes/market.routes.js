const express = require("express");

const router = express.Router();

const marketController =
    require("../controllers/market.controller");

router.get(
    "/",
    marketController.getAll
);

router.get(
    "/:marketId",
    marketController.getById
);

router.get(
    "/match/:matchId",
    marketController.getByMatch
);

router.get(
    "/prediction-version/:predictionVersionId",
    marketController.getByPredictionVersion
);

router.post(
    "/",
    marketController.create
);

router.put(
    "/:marketId",
    marketController.update
);

router.patch(
    "/:marketId/deactivate",
    marketController.deactivate
);

router.delete(
    "/:marketId",
    marketController.delete
);

module.exports = router;