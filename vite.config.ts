import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mix from "vite-plugin-mix";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mix({
      handler: "./server/server.ts",
    }),
  ],
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true,
    hmr: {
      timeout: Number.MAX_SAFE_INTEGER,
    },
  },
});
