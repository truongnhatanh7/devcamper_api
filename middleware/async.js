// This func is written in currying function (concept from lambda calculus)
const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
