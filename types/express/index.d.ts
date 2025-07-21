import "express";
// we declare global types for the Express Request object
// we include only what we need and the user is optional as well.
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				name: string;
				email: string;
			};
		}
	}
}
