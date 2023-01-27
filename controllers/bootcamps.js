// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({
		status: true,
		msg: "Show all bootcamps",
	});
};

// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({
		status: true,
		msg: `Get bootcamp ${req.params.bid}`,
	});
};

// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = (req, res, next) => {
	res.status(200).json({
		status: true,
		msg: "Add new bootcamp",
	});
};

// @desc   Update bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({
		status: true,
		msg: `Update bootcamp ${req.params.bid}`,
	});
};

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		status: true,
		msg: `Delete bootcamp ${req.params.bid}`,
	});
};
