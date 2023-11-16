import express from "express";
import http from "http";
import { Server } from "socket.io";
import { MetaverseService } from "./services/service";
import { apiRoutes } from "./routes/apiRoutes";
import cors from "cors";
import { Redis } from "ioredis";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

interface RoomData {
  peopleCount: number;
}

export const redisClient: Redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

const rooms: Record<string, RoomData> = {};
const metaverseService = new MetaverseService(redisClient);

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.config("SET", "notify-keyspace-events", "Ex");

redisClient
  .duplicate()
  .psubscribe("__keyevent@*__:expired", (channel, message) => {
    console.log("Expired key:", message);
    const room = "sala1";

    const regeneratedCoins = metaverseService.generateCoins(room, 10, {
      xmin: 0,
      xmax: 100,
      ymin: 0,
      ymax: 100,
      zmin: 0,
      zmax: 100,
    });

    io.to(room).emit("coinsInRoom", regeneratedCoins);
    io.to(room).emit("regenerateCoins", { room });
  });

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);



io.on('connection', (socket) => {
  const socketId = socket.id;
  const userRooms = new Map();

  socket.on('joinRoom', (room) => {
    userRooms.set(socketId, room);
    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = { peopleCount: 0 };
    }
    rooms[room].peopleCount++;
    io.to(room).emit('peopleInRoom', rooms[room].peopleCount);
    const coins = metaverseService.getCoinsInRoom(room);
    io.to(room).emit("coinsInRoom", coins);
  });


  socket.on("grabCoin", async (coinId) => {
    const room = Object.keys(socket.rooms)[1];

    metaverseService.removeCoin(coinId);

    const updatedCoins = metaverseService.getCoinsInRoom(room);
    io.to(room).emit("coinsInRoom", updatedCoins);
  });

  socket.on("coinGrabbed", async ({ room, coinId }) => {
    metaverseService.removeCoin(coinId);

    const updatedCoins = metaverseService.getCoinsInRoom(room);
    io.to(room).emit("coinsInRoom", updatedCoins);
  });

  socket.on('disconnecting', () => {
    const room = userRooms.get(socketId);
    if (room && rooms[room]) {
      rooms[room].peopleCount--;
      if (rooms[room].peopleCount === 0) {
        delete rooms[room];
      } else {
        io.to(room).emit('peopleInRoom', rooms[room].peopleCount);
      }
    }
    userRooms.delete(socketId);
  });
  
});

app.use("/api", apiRoutes(metaverseService));

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
