import { ModeToggle } from "./components/ModeToggle";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/Signup";
import { ThemeProvider } from "@/app/components/theme/theme-provider";

function App() {
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div className="h-dvh flex items-center">
					<div className="h-fit w-full flex gap-2 justify-center">
						<ModeToggle />
						<SignUp />
						<SignIn />
					</div>
				</div>
			</ThemeProvider>
		</>
	);
}

export default App;
