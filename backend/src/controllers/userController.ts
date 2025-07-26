import asyncHandler from "../middleware/asyncHandler.ts";
import { Request, Response } from "express";
import generateToken from "../utils/generateToken.ts";
import bcrypt from "bcrypt";
import prisma from "../utils/prismaSingleton.ts";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	// todo: change to ZOD validation
	//const passwordSchema = z.string().min(isDev ? 1 : 8);
	const isDevelopment = process.env.NODE_ENV === "development";
	if (!isDevelopment && password.length < 8) {
		res.status(400);
		throw new Error("Password must be at least 8 characters long");
	}

	const normalizedEmail = email.toLowerCase().trim();

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("All fields are required");
	}

	// Check if the user already exists
	const userExists = await prisma.user.findUnique({
		where: {
			email: normalizedEmail,
		},
	});

	if (userExists) {
		res.status(400);
		throw new Error("User already exists!");
	}

	// has the password before we create the user
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	//create the new user
	const user = await prisma.user.create({
		data: {
			name,
			email: normalizedEmail,
			hashedPassword,
		},
	});

	// respond with the user data but omitting the password
	if (user) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
		});
	}
	//res.send("Register Route here");
});

const authenticateUser = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	// todo need to protect password here
	console.log("Before authenticate: ", req.body);
	// todo: use ZOD validation here
	if (!email || !password) {
		res.status(400);
		throw new Error("Email and password are required");
	}
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

	console.log(
		`UserId ${user?.id}: ${user?.name} with email: ${normalizedEmail} and role: ${user?.role}`
	);
	// to prevent timing attacks, user enumeration
	// without this we return and throw the error too quickly
	// giving hackers a way to know if the user exists
	const dummyHash =
		"$2b$10$KbQi1kd6P9zq0RZjFs1Qy.Qf5KxEZIEJjRsl7Rl6NslXhtQa6Xqfa";
	if (!user) {
		await bcrypt.compare(password, dummyHash);
		res.status(401);
		throw new Error("Invalid email or password");
	}
	// check if the passwords match
	const match = await bcrypt.compare(password, user.hashedPassword);
	console.log("PASSWORD MATCH:", match);
	if (!match) {
		res.status(401);
		throw new Error("Invalid email or password");
	}

	// generate a token and store it in a cookie
	// we pass in user and grab what we need
	// with our JwtPayload interface
	generateToken(res, {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role, // include the role in the token
	});

	// return a user without the password
	res.status(200).json({
		id: user.id,
		name: user.name,
		email: user.email,
	});
});

const logout = asyncHandler((req: Request, res: Response) => {
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
	res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
	console.log("from /users: ", req.user);
	if (!req.user) {
		res.status(401);
		throw new Error("Not authorized, no user found");
	}
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
		},
	});
	res.json(users);
});

export { registerUser, authenticateUser, logout, getAllUsers };
