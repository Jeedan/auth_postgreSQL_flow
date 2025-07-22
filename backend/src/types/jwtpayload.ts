// the data we want to store in the token
// we extend this later for roles and permissions
export interface JwtPayload {
	id: string;
	name: string;
	email: string;
}
