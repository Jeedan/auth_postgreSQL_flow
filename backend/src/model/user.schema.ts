import { z } from "zod";

const emailSchema = z
	.email({ message: "Email is invalid." })
	.toLowerCase()
	.trim();

const passwordSchema = z
	.string()
	.min(3, "Password must be at least 3 characters long");

const createUserSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters long"),
	email: emailSchema,
	password: passwordSchema,
});

const loginUserSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export { createUserSchema, loginUserSchema };
