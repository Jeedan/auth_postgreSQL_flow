import type {
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from "express";
import AppError from "../utils/AppError.ts";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http.ts";
import z from "zod";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies.ts";

const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const handleAppError = (res: Response, error: AppError) => {
	return res.status(error.statusCode).json({
		message: error.message,
		statusCode: error.statusCode,
		appErrorCode: error.errorCode,
		stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
	});
};

const handleZodError = (res: Response, error: z.ZodError) => {
	const errors = error.issues.map((err) => ({
		path: err.path.join("."),
		message: err.message,
	}));

	return res.status(BAD_REQUEST).json({
		errors,
		message: error.message,
	});
};

// REWROTE ERROR HANDLER TO BE MORE UNDERSTANDABLE
// ALL OF THIS CODE IS FROM THIS YOUTUBE VIDEO COURSE
// https://www.youtube.com/watch?v=NR2MJk9C1Js
// BY NIKITA DEV
// a link to the github repo
// https://github.com/nikitapryymak/mern-auth-jwt/blob/youtube/backend/src/middleware/errorHandler.ts
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	let statuscode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = error.message;
	// check DB for a bad ID or cast Error
	// err instanceof Prisma.PrismaClientValidationError
	if (error.name === "PrismaClientValidationError") {
		message = "Bad Request";
		statuscode = 400;
	}

	console.log(`PATH ${req.path}`, error);

	if (req.path === REFRESH_PATH) {
		clearAuthCookies(res);
	}

	if (error instanceof z.ZodError) {
		return handleZodError(res, error);
	}

	if (error instanceof AppError) {
		return handleAppError(res, error);
	}
	res.status(INTERNAL_SERVER_ERROR).json({
		message: message,
		stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
	});
	next();
};

export { notFound, errorHandler };
