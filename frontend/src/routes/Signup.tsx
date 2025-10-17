import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>
					Enter a name,email and password to create an account.
				</CardDescription>
				<CardAction>
					<Button variant="link" className="cursor-pointer">
						Sign In
					</Button>
				</CardAction>
			</CardHeader>

			{/* label and input form content */}
			<CardContent>
				<form>
					<div className="flex flex-col gap-6">
						{/* Name */}
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="name"
								placeholder="John Doe"
								required
							/>
						</div>
						{/* Email */}
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="johnDoe@example.com"
								required
							/>
						</div>
						{/* password */}
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="********"
								required
							/>
						</div>
					</div>
				</form>
			</CardContent>
			{/* Footer will have the submit button and then the Social OAuth*/}
			<CardFooter className="flex flex-col gap-2">
				<Button type="submit" className="w-full cursor-pointer">
					Create Account
				</Button>
				<Button variant="outline" className="w-full cursor-pointer">
					<div className="flex gap-2.5 items-center">
						<svg
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
						>
							<path
								fill="#EA4335"
								d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
							></path>
							<path
								fill="#4285F4"
								d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
							></path>
							<path
								fill="#FBBC05"
								d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
							></path>
							<path
								fill="#34A853"
								d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
							></path>
							<path fill="none" d="M0 0h48v48H0z"></path>
						</svg>
						Sign in with Google
					</div>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Signup;
