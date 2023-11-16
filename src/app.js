"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const service_1 = require("./services/service");
const apiRoutes_1 = require("./routes/apiRoutes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const metaverseService = new service_1.MetaverseService();
metaverseService.startCoinGenerationTimer();
const PORT = process.env.PORT || 3000;
app.use(
  (0, cors_1.default)({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
    const coins = metaverseService.getCoinsInRoom(room);
    io.to(socket.id).emit("coinsInRoom", coins);
  });
  socket.on("grabCoin", (coinId) => {
    metaverseService.removeCoin(coinId);
    io.to(socket.id).emit("coinGrabbed", coinId);
    socket.broadcast
      .to(socket.rooms.values().next().value)
      .emit("coinGrabbed", coinId);
  });
});
app.use("/api", (0, apiRoutes_1.apiRoutes)(metaverseService));
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
