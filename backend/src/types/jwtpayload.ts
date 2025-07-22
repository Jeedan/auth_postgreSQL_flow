// the data we want to store in the token

import { Role } from "@prisma/client";

// we extend this later for roles and permissions
export interface JwtPayload {
	id: string;
	name: string;
	email: string;
	role: Role;
}
