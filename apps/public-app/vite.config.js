import react from "@vitejs/plugin-react";
import "dotenv/config";
const PORT = parseInt(process.env.PORT || "8081", 10);

/**
 * @type {import('vite').UserConfig}
 */
export default {
  root: "./apps/public-app/",
  base: "/",
  build: {
    outDir: "../../dist/public",
    rollupOptions: {
      input: "./apps/public-app/index.html",
    },
  },
  server: {
    port: PORT,
    middlewareMode: true,
  },
  define: {},
  plugins: [react()],
};
