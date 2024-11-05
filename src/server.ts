import express, { Request, Response } from "express";
import { createServer } from "@httptoolkit/httpolyglot";
import https from "https";
import fs from "fs";
import path from "path";

const app = express();

app.use("/sfu", express.static(path.join(__dirname, "..", "public")));

app.get("", (_req: Request, res: Response) => {
  res.send("Hello from express server");
});

const options: https.ServerOptions = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
};

const httpolyglotServer = createServer(options, app);

httpolyglotServer.listen(3000, () => {
  console.log("Server running on port 3000");
});
