const express = require("express");

const router = express.Router();

const roomMatchSelectionController =
    require(
        "../controllers/roomMatchSelection.controller"
    );

router.get(
    "/",
    roomMatchSelectionController.getAll
);

router.get(
    "/room/:roomId",
    roomMatchSelectionController.getByRoom
);

router.get(
    "/match/:matchId",
    roomMatchSelectionController.getByMatch
);

router.post(
    "/",
    roomMatchSelectionController.create
);

router.delete(
    "/:selectionId",
    roomMatchSelectionController.delete
);

module.exports = router;