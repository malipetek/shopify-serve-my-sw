// @ts-check
import { WebSocketServer } from "ws";
import express from "express";
import "dotenv/config";
import embeddedApp from "./sub-apps/embedded-app/embedded-app.js";
import publicApp from "./sub-apps/public-app.js";

const PORT = parseInt(process.env.PORT || "8081", 10);

const app = express();

const httpServer = app.listen(PORT);
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

// httpServer.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, socket => {
//     wss.emit('connection', socket, request);
//   });
// });
