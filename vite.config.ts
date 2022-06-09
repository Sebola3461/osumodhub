import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mix from "vite-plugin-mix";
import { networkInterfaces } from "os";

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
      port: Number(process.env.PORT) || 3000,
      host: networkInterfaces()["Ethernet"].pop().address,
      timeout: Number.MAX_SAFE_INTEGER,
    },
  },
});
