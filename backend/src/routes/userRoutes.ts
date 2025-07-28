import express from "express";
import { protect, validateZodSchema } from "../middleware/authMiddleware.ts";
import { createUserSchema, loginUserSchema } from "../model/user.schema.ts";
import {
	authenticateUser,
	registerUser,
	logout,
	getAllUsers,
	getUser,
} from "../controllers/userController.ts";

const router = express.Router();

router
	.route("/register")
	.post(validateZodSchema(createUserSchema), registerUser);

router
	.route("/auth")
	.post(validateZodSchema(loginUserSchema), authenticateUser);

router.post("/logout", protect, logout);

router.get("/profiles", protect, getAllUsers);

router.get("/me", protect, getUser);

export default router;
