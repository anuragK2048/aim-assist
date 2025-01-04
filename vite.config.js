import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  // server: {
  //   //for preventing reload in mobile when reconnecting to internet
  //   hmr: {
  //     overlay: false, // Disable error overlay (optional)
  //     clientPort: 443, // Specify client port for WebSocket if necessary
  //   },
  // },
});
