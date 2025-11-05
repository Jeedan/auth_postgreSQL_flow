import asyncHandler from "../middleware/asyncHandler.ts";
import type { RequestHandler } from "express";
import generateToken, {
	refreshTokenSignOptions,
	verifyToken,
} from "../utils/jwt.ts";
import bcrypt from "bcrypt";
import prisma from "../utils/prismaSingleton.ts";
import {
	createAccount,
	loginUser,
	refreshUserAccessToken,
} from "../services/auth.service.ts";
import {
	accessTokenName,
	clearAuthCookies,
	getAccessTokenCookieOptions,
	getRefreshTokenCookieOptions,
	refreshTokenName,
	setAuthCookies,
} from "../utils/cookies.ts";
import { CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http.ts";
import appAssert from "../utils/appAssert.ts";

const registerUserHandler = asyncHandler(async (req, res) => {
	// these console logs don't trigger
	console.log("NEW REGISTER USER TEST: ", req.body);
	const { userWithoutPassword, accessToken, refreshToken } =
		await createAccount(req.body);

	return setAuthCookies({ res, accessToken, refreshToken })
		.status(CREATED)
		.json({ user: userWithoutPassword });
});

const loginHandler: RequestHandler = asyncHandler(async (req, res) => {
	const { accessToken, refreshToken } = await loginUser(req.body);
	console.log("LOGIN HANDLER:", req.body);
	// set cookies
	return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
		message: "Login successful",
	});
});

const logout: RequestHandler = asyncHandler((req, res) => {
	const accessToken = req.cookies.accessToken as string | undefined;
	const { payload } = verifyToken(accessToken || "");

	if (!req.user) {
		res.status(401);
		throw new Error("No User found");
	}
	// set the jwt token to expire immediately
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});

	console.log(
		`UserId ${req.user.id}: ${req.user.name} logged out successfully`
	);
	return clearAuthCookies(res)
		.status(OK)
		.json({ message: "Logged out successfully" });
});

const refreshTokenHandler: RequestHandler = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken as string | undefined;
	appAssert(refreshToken, UNAUTHORIZED, "No refresh token provided");
	// refresh tokens
	const { accessToken, newRefreshToken } = await refreshUserAccessToken(
		refreshToken
	);

	if (newRefreshToken) {
		console.log("handler: ", newRefreshToken);

		res.cookie(
			refreshTokenName,
			newRefreshToken,
			getRefreshTokenCookieOptions()
		);
	}

	return res
		.status(OK)
		.cookie(accessTokenName, accessToken, getAccessTokenCookieOptions())
		.json({ message: "Access Token refreshed" });
});

// get all users from the database
const getAllUsers: RequestHandler = asyncHandler(async (req, res) => {
	console.log("from /users: ", req.user);
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
		},
	});

	// check if we have users
	appAssert(users, NOT_FOUND, "No users found");

	res.json(users);
});

const getUser: RequestHandler = asyncHandler(async (req, res) => {
	// check if we even have a user
	appAssert(req.user, UNAUTHORIZED, "Not authorized or no user found");

	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: {
			id: true,
			name: true,
			email: true,
			role: true, // include the role in the response
		},
	});

	appAssert(user, NOT_FOUND, "User not found");

	console.log("from /me: ", user);

	res.status(200).json({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	});
});

const getUserById: RequestHandler = asyncHandler(async (req, res) => {
	const { id: userId } = req.params;
	// check if we even have a user
	if (!req.user) {
		res.status(401);
		throw new Error("Not authorized, no user found");
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true, // include the role in the response
		},
	});

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}
	console.log("from /me: ", user);

	res.status(200).json({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	});
});

export {
	registerUserHandler as registerUserTest,
	loginHandler,
	logout,
	getAllUsers,
	getUser,
	getUserById,
	refreshTokenHandler,
};
