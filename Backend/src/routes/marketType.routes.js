const express = require("express");

const router = express.Router();

const marketTypeController =
    require("../controllers/marketType.controller");

router.get(
    "/",
    marketTypeController.getAll
);

router.get(
    "/:marketTypeId",
    marketTypeController.getById
);

router.post(
    "/",
    marketTypeController.create
);

router.put(
    "/:marketTypeId",
    marketTypeController.update
);

router.delete(
    "/:marketTypeId",
    marketTypeController.delete
);

module.exports = router;