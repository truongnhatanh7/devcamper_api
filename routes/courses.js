const express = require("express");
const { getCourses } = require("../controllers/courses");
const router = express.Router({ mergeParams: true }); // Because re-route from bootcamp

router.route("/").get(getCourses);

module.exports = router;
