const express = require("express");
const reportController = require("./../controllers/reportController");

const router = express.Router();

// use this route after /api in app.js file i.e /api/reports should give me all reports
router.route("/reports").get(reportController.getAllReports);

// use this route after /api i.e /api/report tio create new report through form
router.route("/create").post(reportController.createReport)


module.exports = router