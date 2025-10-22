import SignIn from "./routes/SignIn";
import SignUp from "./routes/Signup";

function App() {
	return (
		<>
			<div className="h-dvh flex items-center">
				<div className="h-fit w-full flex gap-2 justify-center">
					<SignUp />
					<SignIn />
				</div>
			</div>
		</>
	);
}

export default App;
