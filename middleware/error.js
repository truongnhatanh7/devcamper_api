const errorHandler = (err, req, res, next) => {
	// Log for dev
	console.log(err.stack.red);

	res.status(err.statusCode || 500).json({
		success: false,
		error: err.message,
	});
};

module.exports = errorHandler;
