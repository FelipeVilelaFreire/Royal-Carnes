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
      "@/manifests": path.resolve(__dirname, "../shared-core/manifests"),
      "@/locales": path.resolve(__dirname, "../shared-core/locales"),
      "@/navigation": path.resolve(__dirname, "../shared-core/navigation"),
      "@/view-models": path.resolve(__dirname, "../shared-core/view-models"),
      "@/contracts": path.resolve(__dirname, "../shared-core/contracts"),
      "@/api": path.resolve(__dirname, "../shared-core/api"),
      "@/hooks": path.resolve(__dirname, "../shared-core/hooks"),
      "@royalprime/admin": path.resolve(__dirname, "../shared-core"),
      "@": path.resolve(__dirname, "./src"),
      "@foundation": path.resolve(__dirname, "../../foundation"),
      "@shared-core": path.resolve(__dirname, "../../shared-core")
    }
  }
});
