import { Request, Response, RequestHandler, NextFunction} from "express";

// a function that calls the middleware function as a callback in a Promise
const asyncHandler = (fn: RequestHandler	): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
	return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
