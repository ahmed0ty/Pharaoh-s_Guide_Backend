import { Redis } from '@upstash/redis';
import dns from 'dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  connect() {
    if (this.client) return this.client;

    this.client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    this.isConnected = true;
    console.log('✅ Redis connected');

    return this.client;
  }

  getClient() {
    if (!this.client) this.connect();
    return this.client;
  }

  async ping() {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch { return false; }
  }

  async disconnect() {
    this.client = null;
    this.isConnected = false;
  }
}

const redisInstance = new RedisClient();
export const connectRedis = () => redisInstance.connect();
export const getRedis = () => redisInstance.getClient();
export default redisInstance;