const express = require("express");
const router = express.Router();

const feature_controller = require("../controllers/featuresController");

router.get("/today_features", feature_controller.today_features);
router.get("/today_stats", feature_controller.today_stats);
router.post("/add_polygon", feature_controller.add_polygon);

module.exports = router;