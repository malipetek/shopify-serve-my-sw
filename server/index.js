// @ts-check
import { resolve } from "path";
import http from "http";
import { WebSocketServer } from "ws";
import express from "express";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";
import fs from "fs";
import embeddedApp from "./sub-apps/embedded-app/embedded-app.js";
import publicApp from "./sub-apps/public-app.js";
import vhost from "vhost";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

let root = process.cwd();
let isProd = process.env.NODE_ENV === "production";
const app = express();
const httpServer = http.createServer({}, app);
const wss = new WebSocketServer({ server: httpServer });

app.use(express.json());
app.use((req, res, next) => {
  // console.log("request received", req.path);
  next();
});

app.use(
  "/app",
  (req, res, next) => {
    // console.log('emb app');
    next();
  },
  await embeddedApp(app, wss)
);

app.use(
  "/",
  (req, res, next) => {
    // console.log('public app', req.path);
    next();
  },
  await publicApp(wss)
);

// httpServer.on('upgrade', function (request, socket, head) {
//   console.log('upgrade request received');
//     // wss.handleUpgrade(request, socket, head, socket => {
//     //   console.log(`Websocket connected to ${request.url}`);
//     // });
// });
httpServer.listen(PORT, () => console.log("Listening"));
