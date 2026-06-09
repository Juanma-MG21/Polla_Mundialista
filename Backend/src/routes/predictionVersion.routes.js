const express = require("express");

const router = express.Router();

const predictionVersionController = require(
    "../controllers/predictionVersion.controller"
);

router.post(
    "/match/:matchId",
    predictionVersionController.create
);

router.get(
    "/match/:matchId",
    predictionVersionController.getByMatch
);

router.get(
    "/match/:matchId/latest",
    predictionVersionController.getLatest
);

router.patch(
    "/:versionId/deactivate",
    predictionVersionController.deactivate
);

module.exports = router;