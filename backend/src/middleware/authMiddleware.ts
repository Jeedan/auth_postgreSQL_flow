import asyncHandler from "./asyncHandler.ts";
import type { NextFunction, Request, Response } from "express";
import prisma from "../utils/prismaSingleton.ts";
import type { JwtPayload } from "../types/jwtpayload.ts";
import { z } from "zod";
import appAssert from "../utils/appAssert.ts";
import { AppErrorCode, UNAUTHORIZED } from "../constants/http.ts";
import { verifyToken } from "../utils/jwt.ts";

const authenticate = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		console.log("Authenticating user in authMiddleware");
		let accessToken = req.cookies.accessToken as string | undefined;
		appAssert(
			accessToken,
			UNAUTHORIZED,
			"Not Authorized",
			AppErrorCode.InvalidAccessToken
		);

		const { error, payload } = verifyToken(accessToken);
		appAssert(
			payload,
			UNAUTHORIZED,
			error === "jwt expired" ? "Token expired" : "Invalid token",
			AppErrorCode.InvalidAccessToken
		);
		const user = await prisma.user.findUnique({
			where: { id: payload.userId },
			select: {
				id: true,
				name: true,
				email: true,
				role: true, // include the role in the user object
			},
		});
		req.user = user as JwtPayload | undefined;
		next();
	}
);

// authorization middleware
// this checks for roles and permissions
// like admin or editor or just specific permissions
const authorize = (requiredRole: string) =>
	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		const role = req.user?.role;
		if (!req.user) {
			return res.status(401).json({ message: "No user found" });
		}

		if (role !== requiredRole) {
			return res.status(403).json({
				message: `Forbidden, requires ${requiredRole} role to access`,
			});
		}

		// check if we have requiredRole
		// && check if the user's permissions include the required permissions
		// if they don't return a 403 forbidden error missing permissions

		// Authorized! We pass all the checks
		next();
	});

console.log("validateZodSchema loaded");

const validateZodSchema =
	(schema: z.ZodObject<any, any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			const issues = result.error.issues.map((issue) => ({
				path: issue.path.join("."),
				message: issue.message,
			}));
			return res.status(400).json({
				message: "Validation error",
				errors: issues,
			});
		}
		const { password, ...safeBody } = result.data;

		console.log("validated schema:", safeBody);
		req.body = result.data;
		next();
	};

export { validateZodSchema, authorize, authenticate };
