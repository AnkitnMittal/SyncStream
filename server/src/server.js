import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import roomRoutes from './routes/roomRoutes.js';
import { initSocket } from './socket/socket.js';
import { connectDB } from './config/db.js';

import { securityMiddleware } from './middleware/securityMiddleware.js';
import { loggerMiddleware } from './middleware/loggerMiddleware.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(securityMiddleware);
app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());

await connectDB();
await initSocket(httpServer);

app.use('/api/rooms', roomRoutes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Distributed SyncStream server running efficiently on port ${PORT}`);
});
