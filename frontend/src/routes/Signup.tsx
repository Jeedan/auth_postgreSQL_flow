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
					<Button variant="link">Sign In</Button>
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
				<Button type="submit" className="w-full">
					Create Account
				</Button>
				<Button variant="outline" className="w-full">
					Sign up with Google
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Signup;
