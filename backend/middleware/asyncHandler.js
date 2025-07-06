// a function that calls the middleware function as a callback in a Promise
const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
