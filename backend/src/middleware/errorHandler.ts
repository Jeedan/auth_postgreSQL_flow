import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
