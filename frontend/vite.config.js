import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A API do backend roda na porta 3000, entao o front usa a 5173 (padrao Vite).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
