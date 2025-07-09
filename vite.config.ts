import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@types": path.resolve(__dirname, "./src/types/index.ts"),
      "@routes": path.resolve(__dirname, "./src/routes/index.tsx"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@providers": path.resolve(__dirname, "./src/providers"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
