const express = require("express");

const router = express.Router();

const playerRatingController = require(
    "../controllers/playerRating.controller"
);

router.post(
    "/",
    playerRatingController.createSnapshot
);

router.get(
    "/:playerId/latest",
    playerRatingController.getLatestRating
);

router.get(
    "/:playerId/history",
    playerRatingController.getHistory
);

module.exports = router;