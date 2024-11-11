import express from "express";
import { createServer } from "@httptoolkit/httpolyglot";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";

const app = express();

app.use("/sfu", express.static(path.join(__dirname, "..", "public")));

app.get("/", (_req, res) => {
  res.send("Hello from express server");
});

const options = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
};

const httpolyglotServer = createServer(options, app);
httpolyglotServer.listen(3000, () => {
  console.log("Server running on port 3000");
});

const io = new Server(httpolyglotServer);

const peers = io.of("/media-soup");
peers.on("connection", (socket) => {
  console.log("socket.id", socket.id);
  socket.emit("connection-success", { socketId: socket.id });
});
