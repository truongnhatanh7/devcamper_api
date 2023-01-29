const express = require("express");
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courses");
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true }); // Because re-route from bootcamp

router.route("/")
	.get(
		advancedResults(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		getCourses
	)
	.post(protect, authorize("publisher", "admin"), addCourse);
router.route("/:id")
	.get(getCourse)
	.put(protect, authorize("publisher", "admin"), updateCourse)
	.delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
