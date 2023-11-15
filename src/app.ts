import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { MetaverseService } from './services/service';
import { apiRoutes } from './routes/apiRoutes';
import cors from 'cors';

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

const rooms: Record<string, RoomData> = {}; // Utiliza Record<string, RoomData> para especificar el tipo

const metaverseService = new MetaverseService();
metaverseService.startCoinGenerationTimer();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = { peopleCount: 0 };
    }

    rooms[room].peopleCount++;

    
    io.to(room).emit('peopleInRoom', rooms[room].peopleCount);

    const coins = metaverseService.getCoinsInRoom(room);
    io.to(socket.id).emit('coinsInRoom', coins);
  });

  socket.on('grabCoin', (coinId) => {
    metaverseService.removeCoin(coinId);
    io.to(socket.id).emit('coinGrabbed', coinId);
    socket.broadcast.to(socket.rooms.values().next().value).emit('coinGrabbed', coinId);
  });


  socket.on('disconnect', () => {
    const room = socket.rooms.values().next().value;
    if (rooms[room]) {
      rooms[room].peopleCount--;

    
      io.to(room).emit('peopleInRoom', rooms[room].peopleCount);

      if (rooms[room].peopleCount === 0) {
        
        delete rooms[room];
      }
    }
  });
});

app.use('/api', apiRoutes(metaverseService));

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});







