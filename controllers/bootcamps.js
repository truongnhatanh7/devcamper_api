const path = require("path");
const ErrorResponse = require("../utils/errorRespone");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamps/:bid
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.bid);

	res.status(200).json({
		status: true,
		data: bootcamp,
	});
});

// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	// Add user to req.body
	req.body.user = req.user.id;

	// Check for published bootcamp
	const publishedBootcamp = await Bootcamp.findOne({
		user: req.user.id,
	});

	// If the user is not an admin, they can only add one bootcamp
	if (publishedBootcamp && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`The user with id ${req.user.id} has already published a bootcamp`,
				400
			)
		);
	}

	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

// @desc   Update bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	let bootcamp = await Bootcamp.findById(req.params.bid);

	// Mkae sure user is bootcamp owner
	if (
		bootcamp.user.toString() !== req.user.id &&
		req.user.role !== "admin"
	) {
		return next(
			new ErrorResponse(
				`The user with id ${req.user.id} is not authorized`,
				400
			)
		);
	}

	bootcamp = await Bootcamp.findByIdAndUpdate(req.params.bid, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: true,
		data: bootcamp,
	});
});

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.bid);
	if (bootcamp) {
		bootcamp.remove();
	}

	res.status(200).json({
		status: true,
		data: {},
	});
});

// @desc   Get bootcamps within a radius
// @route  DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dist by radius of Earth
	// Earth Radius = 3,963 mi / 6.378 km
	const radius = distance / 3963;

	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: {
				$centerSphere: [[lng, lat], radius],
			},
		},
	});

	res.status(200).json({
		status: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @desc 	 Upload photo for bootcamp
// @route  PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.bid);
	if (!bootcamp) {
		return next(new ErrorResponse("Bootcamp not found", 400));
	}

	if (!req.files) {
		return next(new ErrorResponse("Please upload a file", 400));
	}

	const file = req.files.file;

	// Check is a photo
	if (!file.mimetype.startsWith("image")) {
		return next(
			new ErrorResponse("Please upload an image file", 400)
		);
	}

	// Check filesize
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				"Please upload an image less than 1MB",
				400
			)
		);
	}

	// Create custom file name
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`; // path.parse(x).ext to get file extension

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(
				new ErrorResponse(
					"Problem with file upload",
					500
				)
			);
		}
		await Bootcamp.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});

		res.status(200).json({
			status: true,
			data: {},
		});
	});
});
