import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 80,
    },
    define: {
      ...Object.keys(env).reduce((prev: Record<string, any>, key) => {
        const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "_");

        prev[`process.env.${sanitizedKey}`] = JSON.stringify(env[key]);

        return prev;
      }, {}),
    },
  };
});
