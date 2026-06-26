import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

export async function configureRedisAdapter(io) {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return;

  try {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.error('Redis PubClient Error:', err));
    subClient.on('error', (err) => console.error('Redis SubClient Error:', err));

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log('Redis Pub/Sub Adapter successfully integrated with Socket.io');
  } catch (redisError) {
    console.error('Redis connection failed. Falling back to in-memory adapter:', redisError);
  }
}
