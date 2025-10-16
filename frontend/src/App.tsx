import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div className="min-h-dvh flex flex-col justify-center items-center">
				<div className="flex">
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img src={reactLogo} alt="React logo" />
					</a>
				</div>
				<h1 className="text-5xl leading-[1.1]">Vite + React</h1>
				<Button
					variant="secondary"
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
				<p>Click on the Vite and React logos to learn more</p>
			</div>
		</>
	);
}

export default App;
