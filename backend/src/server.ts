import express from "express";
import dotenv from "dotenv";

dotenv.config();

import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { notFound, errorHandler } from "./middleware/errorHandler.ts";
import userRoutes from "./routes/userRoutes.ts";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser()); // parse cookies for JWT and other purposes
app.use(helmet()); // Helmet helps secure Express apps by setting various HTTP headers
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
