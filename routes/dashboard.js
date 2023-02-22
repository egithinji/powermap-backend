const express = require("express");
const router = express.Router();

const dashboard_controller = require("../controllers/dashboardController");

router.get("/total_complaints_day", dashboard_controller.total_complaints_day);
router.get("/total_complaints_area", dashboard_controller.total_complaints_area);

module.exports = router;