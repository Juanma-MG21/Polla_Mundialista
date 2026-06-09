const express = require("express");

const router = express.Router();

const teamStatisticsController = require(
    "../controllers/teamStatistics.controller"
);

router.get(
    "/",
    teamStatisticsController.getAll
);

router.get(
    "/team/:teamId",
    teamStatisticsController.getByTeam
);

router.get(
    "/team/:teamId/latest",
    teamStatisticsController.getLatest
);

router.post(
    "/",
    teamStatisticsController.create
);

router.put(
    "/:statisticId",
    teamStatisticsController.update
);

router.delete(
    "/:statisticId",
    teamStatisticsController.delete
);

module.exports = router;