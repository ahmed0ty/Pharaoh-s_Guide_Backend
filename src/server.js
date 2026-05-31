

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });


import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import http from 'http';
import app from './app.controller.js';
import mongoose from 'mongoose';
import { initSocket } from './socket.js';
import { connectRedis } from './utils/redis.util.js';

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected ✅');

    connectRedis();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
  } catch (error) {
    console.log('Error starting server ❌', error);
  }
};

bootstrap();