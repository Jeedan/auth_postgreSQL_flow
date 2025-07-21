import express from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { notFound, errorHandler } from "./middleware/errorHandler.ts";
import asyncHandler from "./middleware/asyncHandler.ts";
import generateToken from "./utils/generateToken.ts";
import prisma from "./utils/prismaSingleton.ts";
import protect from "./middleware/authMiddleware.ts";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send("API running on /");
});

// auth routes
app.post(
	"/register",
	asyncHandler(async (req: Request, res: Response) => {
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
	})
);

app.post(
	"/auth",
	asyncHandler(async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const normalizedEmail = email.toLowerCase().trim();
		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		console.log("USER:", user);
		// check if the passwords match
		if (user) {
			const match = await bcrypt.compare(password, user.hashedPassword);
			console.log("PASSWORD MATCH:", match);
			if (match) {
				// generate a token and store it in a cookie
				generateToken(res, user.id);
				// return a user without the password
				res.status(200).json({
					id: user.id,
					name: user.name,
					email: user.email,
				});
			}
		} else {
			res.status(401);
			throw new Error("Invalid email or password");
		}
		//res.send("Authenticate Route here");
	})
);

app.post(
	"/logout",
	asyncHandler((req: Request, res: Response) => {
		res.status(201).json({ message: "Logged out successfully" });
	})
);

app.post("/googleOAuth", (req: Request, res: Response) => {
	res.send("Authenticate Route here");
});

// get all users
app.get(
	"/users",
	protect,
	asyncHandler(async (req: Request, res: Response) => {
		const users = await prisma.user.findMany();
		res.json(users);
	})
);

// error handling middleware
app.use(notFound);
app.use(errorHandler);

// start the server
app.listen(PORT, () => {
	console.log(`Server is running on Port: http://localhost:${PORT}`);
});
