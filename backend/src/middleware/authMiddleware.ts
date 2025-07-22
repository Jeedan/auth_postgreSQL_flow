import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prismaSingleton.ts";
import { JwtPayload } from "../types/jwtpayload.js";

const protect = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		console.log("Protect middleware loaded");

		let token;
		// read the JWT from the cookies in the request
		token = req.cookies?.jwt;

		// no token found in the cookies
		if (!token) {
			res.status(401);
			throw new Error("Not Authorized, no token");
		}

		try {
			// decode the token to get the ID
			// process.env.JWT_SECRET! means its either of type string or undefined
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET!
			) as JwtPayload;
			const user = await prisma.user.findUnique({
				where: { id: decoded.id },
				select: {
					id: true,
					name: true,
					email: true,
				},
			});

			if (!user) {
				res.status(401);
				throw new Error("User not found");
			}

			// store it on the request object
			// we created global types for this in the root
			req.user = user;
			// move to next middleware
			next();
		} catch (err) {
			console.error("Error in authMiddleware:", err);
			//console.log(err);
			res.status(401);
			throw new Error("Not Authorized, token failed");
		}
	}
);

export default protect;
