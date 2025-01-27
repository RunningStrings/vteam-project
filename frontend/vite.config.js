import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/users": "http://backend:5000/api/v1",
            "/bikes": "http://backend:5000/api/v1",
            "/cities": "http://backend:5000/api/v1",
            "/charging_stations": "http://backend:5000/api/v1",
            "/parking_zones": "http://backend:5000/api/v1",
            "/login": {
                target: "http://backend:5000/api/v1",
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    },
});
