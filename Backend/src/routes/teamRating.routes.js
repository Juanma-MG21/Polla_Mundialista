const express = require("express");

const router = express.Router();

const teamRatingController = require(
    "../controllers/teamRating.controller"
);

router.post(
    "/",
    teamRatingController.createSnapshot
);

router.get(
    "/:teamId/latest",
    teamRatingController.getLatestRating
);

router.get(
    "/:teamId/history",
    teamRatingController.getHistory
);

module.exports = router;