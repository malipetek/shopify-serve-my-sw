import react from "@vitejs/plugin-react";
import "dotenv/config";

const PORT = parseInt(process.env.PORT || "8081", 10);

/**
 * @type {import('vite').UserConfig}
 */
export default {
  root: "./apps/embedded-app/",
  base: "/app/",
  cacheDir: `${process.cwd()}/node_modules/.embeddedvite/`,
  build: {
    outDir: "../../dist/embedded",
    rollupOptions: {
      input: "./apps/embedded-app/index.html",
    },
  },
  server: {
    base: "/app/",
    port: PORT,
    middlewareMode: true,
  },
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
  },
  plugins: [react()],
};
