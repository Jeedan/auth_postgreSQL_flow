import asyncHandler from "../middleware/asyncHandler.ts";
import type { RequestHandler } from "express";
import type { RefreshTokenPayload } from "../utils/jwt.ts";
import {
	refreshTokenSignOptions,
	signToken,
	verifyToken,
} from "../utils/jwt.ts";
import bcrypt from "bcrypt";
import prisma from "../utils/prismaSingleton.ts";
import appAssert from "../utils/appAssert.ts";
import { CONFLICT, UNAUTHORIZED } from "../constants/http.ts";
import { oneDayInSeconds } from "../utils/date.ts";

type CreateAccountParams = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export const createAccount = async (data: CreateAccountParams) => {
	// very user doesn't already exist
	// sign refreshToken
	// sign accessToken
	// return the created user without password
	// also return the tokens as httpOnly cookies
	// these console logs don't trigger
	console.log("Registering user: ", data.name);
	const normalizedEmail = data.email.toLowerCase().trim();

	// Check if the user already exists
	const userExists = await prisma.user.findUnique({
		where: {
			email: normalizedEmail,
		},
	});
	// throw custom app error
	appAssert(!userExists, CONFLICT, "Email already in use");

	// hash the password before we create the user
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(data.password, salt);

	//create the new user
	const user = await prisma.user.create({
		data: {
			name: data.name,
			email: normalizedEmail,
			hashedPassword,
		},
	});

	// create access and refresh tokens
	const refreshToken = signToken(
		{ userId: user.id },
		refreshTokenSignOptions
	);

	const accessToken = signToken({ userId: user.id });
	// respond with the user data but omitting the password
	const userWithoutPassword = {
		name: user.name,
		email: user.email,
	};
	return { userWithoutPassword, accessToken, refreshToken };
};

type LoginParams = {
	email: string;
	password: string;
};

export const loginUser = async ({ email, password }: LoginParams) => {
	// find user by email from prisma

	// sign accessToken and refreshToken
	// omit password from both tokens
	// pass the userId, name, email etc to accessToken
	// return the user data without password
	// also the tokens as httpOnly cookies
	const normalizedEmail = email.toLowerCase().trim();
	const user = await prisma.user.findUnique({
		where: { email: normalizedEmail },
		select: {
			id: true,
			name: true,
			email: true,
			hashedPassword: true,
			role: true,
		},
	});

	// assert the credentials are valid
	appAssert(user, UNAUTHORIZED, "Invalid email or password");

	console.log(
		`UserId ${user?.id}: ${user?.name} with email: ${normalizedEmail} and role: ${user?.role}`
	);
	// to prevent timing attacks, user enumeration
	// without this we return and throw the error too quickly
	// giving hackers a way to know if the user exists
	const dummyHash =
		"$2b$10$KbQi1kd6P9zq0RZjFs1Qy.Qf5KxEZIEJjRsl7Rl6NslXhtQa6Xqfa";
	await bcrypt.compare(password, dummyHash);
	// assert the credentials are valid
	appAssert(user, UNAUTHORIZED, "Invalid email or password");

	// check if the passwords match
	const match = await bcrypt.compare(password, user.hashedPassword);
	appAssert(match, UNAUTHORIZED, "Invalid email or password");
	console.log("PASSWORD MATCH:", match);

	const userId: RefreshTokenPayload = { userId: user.id };

	const refreshToken = signToken(userId, refreshTokenSignOptions);
	const accessToken = signToken({ userId: user.id });

	const userWithoutPassword = {
		id: user.id,
		name: user.name,
		email: user.email,
	};

	return { user: userWithoutPassword, accessToken, refreshToken };
};

// refresh user accessToken and refreshToken if expired
export const refreshUserAccessToken = async (refreshToken: string) => {
	// check if we have a refresh token
	appAssert(refreshToken, UNAUTHORIZED, "No refresh token provided");

	// grab payload from refreshToken payload and verify
	const { error, payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
		secret: refreshTokenSignOptions.secret,
	});
	// assert its valid
	appAssert(
		payload,
		UNAUTHORIZED,
		error === "jwt expired"
			? "Refresh token expired"
			: "Invalid refresh token"
	);
	// get userId from payload and make sure userId exists
	const userId = payload!.userId;
	appAssert(userId, UNAUTHORIZED, "Invalid refresh token payload");

	// grab user from database
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	});

	appAssert(user, UNAUTHORIZED, "User not found");

	// TODO: store the refreshToken on the user in the database
	// check if the user has a refresh token stored
	// then compare the stored refreshToken with the one provided by the request
	// use bcrypt to compare the hashed token
	// assert that they match

	// create new accessToken
	const accessToken = signToken({ userId: user.id });

	// create new token if refresh token is expiring within a day
	const rotationThresholdSeconds = 24 * 60 * 60;
	const nowInSeconds = Math.floor(Date.now() / 1000);
	const tokenExpiryDate = (payload as any).exp as number | undefined;

	const expires =
		!tokenExpiryDate ||
		tokenExpiryDate - nowInSeconds <= rotationThresholdSeconds;

	console.log("token exiry date", { tokenExpiryDate, expires });

	let newRefreshToken: string | undefined;
	if (
		!tokenExpiryDate ||
		tokenExpiryDate - nowInSeconds <= rotationThresholdSeconds
	) {
		// create and sign a new refresh token
		newRefreshToken = signToken(
			{ userId: user.id },
			refreshTokenSignOptions
		);
		// TODO:
		// hash the token then
		// store it in the database on the user
		// use Prisma update method
	}

	// return both tokens
	return { accessToken, newRefreshToken };
};
