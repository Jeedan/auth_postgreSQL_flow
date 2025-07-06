const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler = (err, req, res, next) => {
	let statuscode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = err.message;
	// check DB for a bad ID or cast Error
	// err instanceof Prisma.PrismaClientValidationError
	if (err.name === "PrismaClientValidationError") {
		message = "Bad Request";
		statuscode = 400;
	}

	res.status(statuscode).json({
		message: message,
		stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
	});
	next();
};

export { notFound, errorHandler };
