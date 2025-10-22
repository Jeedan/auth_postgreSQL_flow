import SignIn from "./routes/SignIn";
import SignUp from "./routes/Signup";

function App() {
	return (
		<>
			<div className="h-dvh flex gap-2 justify-center items-center">
				<SignUp />
				<SignIn />
			</div>
		</>
	);
}

export default App;
