import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt"
import { notFound, errorHandler } from "../middleware/errorHandler.js";
import asyncHandler from "../middleware/asyncHandler.js"
import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

// todo: create a singleton for the prisma client to not use multiple by accident
const prisma = new PrismaClient();

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.get("/", (req: Request, res: Response) => {
	
	res.send("API running on /");
});

// auth routes
app.post("/register", asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	const userExists = await prisma.user.findUnique({
		where: {
			email: email
		}
	});

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("All fields are required");
	}
	
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
			email,
			hashedPassword
		}
	})

	if (user) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email
		})
	}
	//res.send("Register Route here");
}));

app.post("/auth", asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({ where: { email } });
	
	// check if the passwords match
	if (user && (await bcrypt.compare(password, user.hashedPassword))) {
		res.json({
			_id: user.id,
			name: user.name,
			email: user.email
		})
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
	//res.send("Authenticate Route here");
}));

app.post("/googleOAuth", (req: Request, res: Response) => {
	res.send("Authenticate Route here");
});

// get all users
app.get( "/users", asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
	res.json(users);
}));

// error handling middleware
app.use(notFound);
app.use(errorHandler);

// start the server
app.listen(PORT, () => {
	console.log(`Server is running on Port: http://localhost:${PORT}`);
});
