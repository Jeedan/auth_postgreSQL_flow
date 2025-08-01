import express from "express";
import { protect, validateZodSchema } from "../middleware/authMiddleware.ts";
import { authRateLimiter } from "../middleware/rateLimiter.ts";
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
	.post(authRateLimiter, validateZodSchema(createUserSchema), registerUser);

router
	.route("/auth")
	.post(
		authRateLimiter,
		validateZodSchema(loginUserSchema),
		authenticateUser
	);

router.post("/logout", protect, logout);

// gets all users
router.get("/profiles", protect, getAllUsers);

// probably make this admin later on
router.get("/:id", protect, getUser);

router.get("/me", protect, getUser);

export default router;
