import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mix from "vite-plugin-mix";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: false,
    }),
    mix({
      handler: "./server/server.ts",
    }),
  ],
  server: {
    hmr: {
      host: process.env.PORT || 3000,
      timeout: Number.MAX_SAFE_INTEGER,
    },
  },
});
