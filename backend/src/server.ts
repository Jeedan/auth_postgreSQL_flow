import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { notFound, errorHandler } from "../middleware/errorHandler.js";
import { Request, Response } from "express";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.get("/", (req: Request, res: Response) => {
	
	res.send("API running on /");
});

// auth routes
app.post("/register", (req: Request, res: Response) => {
	res.send("Register Route here");
});

app.post("/auth", (req: Request, res: Response) => {
	res.send("Authenticate Route here");
});

app.post("/googleOAuth", (req: Request, res: Response) => {
	res.send("Authenticate Route here");
});

// error handling middleware
app.use(notFound);
app.use(errorHandler);

// start the server
app.listen(PORT, () => {
	console.log(`Server is running on Port: http://localhost:${PORT}`);
});
