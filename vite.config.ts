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
    host: true,
    hmr: {
      protocol: "ws",
      port: Number(process.env.PORT) || 3000,
      clientPort: Number(process.env.PORT) || 3000,
      timeout: Number.MAX_SAFE_INTEGER,
    },
  },
});
