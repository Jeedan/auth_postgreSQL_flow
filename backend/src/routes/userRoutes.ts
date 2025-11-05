import express from "express";
import {
	authenticate,
	validateZodSchema,
} from "../middleware/authMiddleware.ts";
import { authRateLimiter } from "../middleware/rateLimiter.ts";
import { loginUserSchema, registerUserSchema } from "../model/user.schema.ts";
import {
	logout,
	getAllUsers,
	getUser,
	registerUserTest,
	loginHandler,
	refreshTokenHandler,
} from "../controllers/userController.ts";

const router = express.Router();

router
	.route("/register")
	.post(
		authRateLimiter,
		validateZodSchema(registerUserSchema),
		registerUserTest
	);

router
	.route("/auth")
	.post(authRateLimiter, validateZodSchema(loginUserSchema), loginHandler);

router.post("/logout", authenticate, logout);

router.get("/refresh", refreshTokenHandler);

// gets all users
router.get("/profiles", authenticate, getAllUsers);

// probably make this admin later on
router.get("/:id", authenticate, getUser);

router.get("/me", authenticate, getUser);

export default router;
