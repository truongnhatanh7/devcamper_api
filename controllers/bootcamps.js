const Bootcamp = require("../models/Bootcamp");

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res.status(200).json({
			status: true,
			data: bootcamps,
		});
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.bid);

		res.status(200).json({
			status: true,
			data: bootcamp,
		});
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @desc   Update bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
	try {
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
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(
			req.params.bid
		);

		res.status(200).json({
			status: true,
			data: {},
		});
	} catch (err) {
		res.status(400).json({ success: false });
	}
};
