import type { CookieOptions, Response } from "express";
import {
	fifteenMinutesFromNow,
	oneDayFromNow,
	oneDayInSeconds,
	thirtyDaysFromNow,
} from "./date.ts";

export const REFRESH_PATH = "/api/users/refresh";

export const accessTokenName = "accessToken";
export const refreshTokenName = "refreshToken";

// when in production set the security mode
const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
	httpOnly: true,
	secure,
	sameSite: "strict",
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: fifteenMinutesFromNow(), // 15 minutes
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: thirtyDaysFromNow(), // 30 days
});

type Params = {
	res: Response;
	accessToken: string;
	refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
	return res
		.cookie(accessTokenName, accessToken, getAccessTokenCookieOptions())
		.cookie(refreshTokenName, refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Response) => {
	return res
		.clearCookie(accessTokenName)
		.clearCookie(refreshTokenName, { path: REFRESH_PATH });
};
