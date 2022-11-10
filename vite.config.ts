import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mix from "vite-plugin-mix";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV == "production"
      ? undefined
      : mix({
          handler: "./server/server.ts",
        }),
  ],
  build: {
    outDir: "./dist",
  },
});
