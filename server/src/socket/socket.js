import { Server } from 'socket.io';
import { configureRedisAdapter } from '../config/redisClient.js';
import { registerSocketEvents } from './socketRouter.js';

export async function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    maxHttpBufferSize: 1e7,
  });

  await configureRedisAdapter(io);

  registerSocketEvents(io);

  return io;
}
