const express = require("express");

const router = express.Router();

const playerStatisticsController =
    require(
        "../controllers/playerStatistics.controller"
    );

router.get(
    "/",
    playerStatisticsController.getAll
);

router.get(
    "/player/:playerId",
    playerStatisticsController.getByPlayer
);

router.get(
    "/player/:playerId/latest",
    playerStatisticsController.getLatest
);

router.post(
    "/",
    playerStatisticsController.create
);

router.put(
    "/:statisticId",
    playerStatisticsController.update
);

router.delete(
    "/:statisticId",
    playerStatisticsController.delete
);

module.exports = router;