import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { VerifyOptions, SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "../types/jwtpayload.ts";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

const generateToken = (res: Response, user: JwtPayload) => {
	// console.log(`Generated token for userId: ${userId}`);
	if (!process.env.JWT_SECRET) {
		throw new Error(
			"JWT_SECRET is not defined in the environment variables"
		);
	}

	// create a payload of our JwtPayload
	// type with the info we want to sign and store in the token
	const payload: JwtPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	// console.log("Token:", token);
	//console.log("NODE_ENV:", process.env.NODE_ENV);
	// 30d converted to milliseconds
	const cookie_max_age = 30 * 24 * 60 * 60 * 1000;
	// set the JWT token to be an httpOnly cookie
	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
		sameSite: "strict",
		maxAge: cookie_max_age,
	});
	// optional but could be useful to return the token
	return token;
};

export type RefreshTokenPayload = {
	userId: string;
};

export type AccessTokenPayload = { userId: string };

export type SignOptionsAndSecret = SignOptions & {
	secret: string;
};

const defaults: SignOptions & VerifyOptions = {
	audience: ["User"],
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
	expiresIn: "15m",
	secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
	expiresIn: "30d",
	secret: JWT_REFRESH_SECRET,
};

export const signToken = (
	payload: AccessTokenPayload | RefreshTokenPayload,
	options?: SignOptionsAndSecret
) => {
	// if no options provided, use access token options
	const { secret, ...signOptions } = options || accessTokenSignOptions;
	return jwt.sign(payload, secret, { ...defaults, ...signOptions });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
	token: string,
	options?: VerifyOptions & {
		secret?: string;
	}
) => {
	const { secret = JWT_SECRET, ...verifyOpts } = options || {};
	try {
		const decoded = jwt.verify(token, secret, {
			...defaults,
			...verifyOpts,
		});

		const payload = decoded as unknown as TPayload;
		return {
			payload,
		};
	} catch (error: any) {
		return {
			error: error.message,
		};
	}
};
export default generateToken;
