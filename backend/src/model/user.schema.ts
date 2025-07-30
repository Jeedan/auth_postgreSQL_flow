import { z } from "zod";
import validator from "validator";

const sanitizeString = (value: string) => {
	return validator.escape(validator.stripLow(value.trim()));
};
//Trimmed, normalized, validated
const emailSchema = z
	.email({ message: "Email is invalid." })
	.refine((value) => validator.isEmail(value), {
		message: "Email is invalid.",
	})
	.transform((value) => validator.normalizeEmail(value) || "")
	.refine((value) => !!value, { message: "Normalized Email is invalid." });

//Trimmed, escaped, control chars removed
const nameSchema = z
	.string()
	.min(3, "Name must be at least 3 characters long")
	.transform((value) => sanitizeString(value));

// Only validated, not escaped (to preserve hashing integrity)
// in production use this for stronger passwords
//.refine((value) => validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, }), { message: "Password must include at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol and be at least 8 characters long." });
const passwordSchema = z
	.string()
	.min(3, "Password must be at least 3 characters long");

const createUserSchema = z.object({
	name: nameSchema,
	email: emailSchema,
	password: passwordSchema,
});

const loginUserSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export { createUserSchema, loginUserSchema };
