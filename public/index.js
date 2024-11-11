const io = require("socket.io-client");
const medisoupClient = require("mediasoup-client");

const socket = io("https://192.168.1.76:3000/media-soup");

let params = {};
let routerRtpCapabilities;
let device;
let producerTransport;
let consumerTransport;

socket.on("connection-success", ({ socketId }) => {
  console.log("connection success on id", socketId);
});

const streamSuccess = (stream) => {
  localVideo.srcObject = stream;

  const track = stream.getVideoTracks()[0];

  params = {
    track,
    ...params,
  };
};

const getLocalStream = () => {
  navigator.getUserMedia(
    {
      audio: false,
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        },
      },
    },
    streamSuccess,
    (error) => {
      console.log(error.message);
    }
  );
};

const getRtpCapabilities = () => {
  socket.emit("get:rtpCapabilities", ({ rtpCapabilities }) => {
    routerRtpCapabilities = rtpCapabilities;
  });
};

const createDevice = async () => {
  try {
    device = new medisoupClient.Device();
    console.log("device", device);

    await device.load({
      routerRtpCapabilities,
    });
  } catch (error) {
    console.log("Error while creating device", error);
  }
};

const createSendTransport = () => {
  socket.emit(
    "create:webRtcTransport",
    { sender: true },
    async ({ params }) => {
      if (params.error) {
        console.log(params.error);
        return;
      }
      console.log("params from server producer", params);

      producerTransport = await device.createSendTransport(params);

      producerTransport.on("connect", () => {});
      producerTransport.on("produce", () => {});
    }
  );
};

btnLocalVideo.addEventListener("click", getLocalStream);
btnRtpCapabilities.addEventListener("click", getRtpCapabilities);
btnDevice.addEventListener("click", createDevice);
btnCreateSendTransport.addEventListener("click", createSendTransport);
// btnConnectSendTransport.addEventListener('click', connectSendTransport)
// btnRecvSendTransport.addEventListener('click', createRecvTransport)
// btnConnectRecvTransport.addEventListener('click', connectRecvTransport)
