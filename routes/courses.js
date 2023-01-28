const express = require("express");
const { getCourses, getCourse, addCourse } = require("../controllers/courses");
const router = express.Router({ mergeParams: true }); // Because re-route from bootcamp

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse);

module.exports = router;
