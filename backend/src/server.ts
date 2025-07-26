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
import { protect, validateZodSchema } from "./middleware/authMiddleware.ts";
import { createUserSchema, loginUserSchema } from "./model/user.schema.ts";
import userRoutes from "./routes/userRoutes.ts";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
	res.send("API running on /");
});

// user routes
app.use("/api/users", userRoutes);

// error handling middleware
app.use(notFound);
app.use(errorHandler);

// start the server
app.listen(PORT, () => {
	console.log(`Server is running on Port: http://localhost:${PORT}`);
});
