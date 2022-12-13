import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import fs from "fs";
import { resolve } from "path";

export default async (wss) => {
  let isProd = process.env.NODE_ENV === "production";
  const PORT = parseInt(process.env.PORT || "8081", 10);
  const isTest =
    process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

  const app = express();
  const router = express.Router();

  let vite;
  if (!isProd) {
    console.log("PORT ", PORT);
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        configFile: `${process.cwd()}/apps/public-app/vite.config.js`,
        logLevel: "info",
        server: {
          hmr: {
            port: 8081,
            protocol: "wss",
            server: wss,
            clientPort: 443,
          },
        },
      })
    );
    router.use((req, res, next) => {
      // req.url = req.url.replace(/\/apps\/public-app/, '');
      // console.log('middleware req ', req.url);
      next();
    }, vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );

    router.use(compression());
    router.use(serveStatic(resolve("dist/public")));
    router.use("*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/public/index.html`));
    });
  }

  app.use(router);

  return router;
};
