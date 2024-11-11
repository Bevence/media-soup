import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import https from "https";
import * as mediasoup from "mediasoup";
import { Router, RtpCodecCapability, Worker } from "mediasoup/node/lib/types";

const app = express();

let worker: Worker;
let router: Router;
const mediaCodecs: RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
];
const appData = {};

app.use("/sfu", express.static(path.join(__dirname, "..", "public")));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from express server");
});

const options = {
  key: fs.readFileSync("../cert/key.pem"),
  cert: fs.readFileSync("../cert/cert.pem"),
};

const httpsServer = https.createServer(options, app);
httpsServer.listen(3000, "192.168.1.76", () => {
  console.log("Server running on port 3000");
});

const io = new Server(httpsServer);

const peers = io.of("/media-soup");

const createWorker = async () => {
  worker = await mediasoup.createWorker();

  console.log(`Worker created of pid ${worker.pid}`);
};
createWorker();

peers.on("connection", async (socket) => {
  socket.emit("connection-success", { socketId: socket.id });

  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected due to ${reason}`);
  });

  socket.on("error", (error) => {
    console.error("Socket encountered an error:", error);
  });

  // Create router
  router = await worker.createRouter({ mediaCodecs, appData });

  console.log("router.get", router.rtpCapabilities);
});
