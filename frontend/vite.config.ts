import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		// proxy requests prefixed with '/api' and '/uploads' to the backend server
		proxy: {
			"/api": "http://localhost:5000",
			"/uploads": "http://localhost:5000",
		},
	},
});
