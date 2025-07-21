import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (res: Response, userId: String) => {
	// console.log(`Generated token for userId: ${userId}`);
	if (!process.env.JWT_SECRET) {
		throw new Error(
			"JWT_SECRET is not defined in the environment variables"
		);
	}
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
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

export default generateToken;
