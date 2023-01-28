const ErrorResponse = require("../utils/errorRespone");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	// Clone req.Query
	const reqQuery = { ...req.query };

	// Fields to exclude
	const removeFields = ["select", "page", "limit", "sort"];

	// Loop over removeFields and delte them from reQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// Create query string
	let queryStr = JSON.stringify(reqQuery);

	// Create operators ($gt, $gte, etc)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// Finding resources
	query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

	// Select Fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		console.log(fields);
		query = query.select(fields);
	}

	// Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 100;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// Executing query
	const bootcamps = await query;

	// Pagination result
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
			total: total,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
			total: total,
		};
	}
	res.status(200).json({
		status: true,
		count: bootcamps.length,
		data: bootcamps,
		pagination: pagination,
	});
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
	const bootcamp = await Bootcamp.findByIdAndUpdate(
		req.params.bid,
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		status: true,
		data: bootcamp,
	});
});

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.bid);

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
