const express = require("express");
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResult");
const router = express.Router();

const { protect } = require("../middleware/auth")

// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/")
	.get(advancedResults(Bootcamp, "courses"), getBootcamps)
	.post(protect, createBootcamp);

router.route("/:bid/photo").put(protect, bootcampPhotoUpload);

router.route("/:bid")
	.get(getBootcamp)
	.put(protect, updateBootcamp)
	.delete(protect, deleteBootcamp);

module.exports = router;
