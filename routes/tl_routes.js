var express = require("express");
var router = express.Router();
var controller = require("../controllers/tl_controller");

router.get("/departures", controller.getNextDepartures);

module.exports = router;
