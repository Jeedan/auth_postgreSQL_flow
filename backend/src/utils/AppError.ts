import { AppErrorCode } from "../constants/http.ts";

import type { HttpStatusCode } from "../constants/http.ts";

class AppError extends Error {
	statusCode: HttpStatusCode;
	errorCode?: AppErrorCode;
	constructor(
		statusCode: HttpStatusCode,
		message: string,
		errorCode?: AppErrorCode
	) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}
}

export default AppError;
