const io = require("socket.io-client");

const socket = io("https://192.168.1.76:3000/media-soup");

socket.on("connection-success", ({ socketId }) => {
  console.log("connection success on id", socketId);
});
