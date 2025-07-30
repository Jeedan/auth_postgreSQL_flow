import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minnutes
	max: 100, // limit each IP to 100 requests per windowMs
	standardHeaders: true, // return rate limit info in the "Rate Limit-*" headers
	legacyHeaders: false, // disable the "X-RateLimit-*" headers
	message: "too many requests from this IP, please try again later",
});
