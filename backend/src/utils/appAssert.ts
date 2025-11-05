import assert from "node:assert";
import AppError from "./AppError.ts";
import { AppErrorCode } from "../constants/http.ts";
import type { HttpStatusCode } from "../constants/http.ts";

type AppAssert = (
	condition: any,
	httpStatusCode: HttpStatusCode,
	message: string,
	appErrorCode?: AppErrorCode
) => asserts condition;

// throw an AppError if condition is falsy
const appAssert: AppAssert = (
	condition,
	httpStatusCode,
	message,
	appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
