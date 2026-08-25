import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true
  },
  resolve: {
    alias: {
      "@/manifest": path.resolve(__dirname, "../shared-core/manifest"),
      "@": path.resolve(__dirname, "./src"),
      "@foundation": path.resolve(__dirname, "../../foundation"),
      "@shared-core": path.resolve(__dirname, "../../shared-core")
    }
  }
});
