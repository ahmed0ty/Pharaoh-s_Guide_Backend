// import dotenv from "dotenv";
// dotenv.config();

// import http from "http";
// import app from "./app.controller.js";
// import mongoose from "mongoose";
// import { initSocket } from "./socket.js";

// const bootstrap = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected ✅");

//     const server = http.createServer(app);
//     initSocket(server);

//     server.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT} 🚀`);
//     });
//   } catch (error) {
//     console.log("Error starting server ❌", error);
//   }
// };

// bootstrap();












// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import authRoutes from './modules/auth/auth.routes.js';
// import userRoutes from './modules/user/user.routes.js';
// import placesRoutes from './modules/places/places.routes.js';
// import aiRoutes from './modules/ai/ai.routes.js';
// import tripPlanRoutes from './modules/tripPlan/tripPlan.routes.js';
// import { errorHandler, notFound } from './middlewares/errorHandler.middleware.js';
// import { logger } from './middlewares/logger.middleware.js';
// import { globalLimiter } from './middlewares/rateLimiter.middleware.js';

// const app = express();

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());
// app.use(logger);
// app.use(globalLimiter);
// // routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/places', placesRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/trip-plans', tripPlanRoutes);

// // test route

// app.get('/', (req, res) => {
//   res.json({ message: 'Egyptian Tourist API is running 🎉' });
// });

// // not found
// app.use(notFound);

// // global error handler
// app.use(errorHandler);

// export default app;









// import dotenv from 'dotenv';
// dotenv.config();

// import http from 'http';
// import app from './app.controller.js';
// import mongoose from 'mongoose';
// import { initSocket } from './socket.js';
// import { connectRedis } from './utils/redis.util.js';

// const bootstrap = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB Connected ✅');

//     connectRedis(); // ← ضيفها هنا

//     const server = http.createServer(app);
//     initSocket(server);

//     server.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT} 🚀`);
//     });
//   } catch (error) {
//     console.log('Error starting server ❌', error);
//   }
// };

// bootstrap();


// import dotenv from 'dotenv';
// dotenv.config();

// import dns from 'dns';
// dns.setServers(['1.1.1.1', '8.8.8.8']);

// import http from 'http';
// import app from './app.controller.js';
// import mongoose from 'mongoose';
// import { initSocket } from './socket.js';
// import { connectRedis } from './utils/redis.util.js';

// const bootstrap = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB Connected ✅');

//     connectRedis();

//     const server = http.createServer(app);
//     initSocket(server);

//     server.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT} 🚀`);
//     });
//   } catch (error) {
//     console.log('Error starting server ❌', error);
//   }
// };

// bootstrap();









import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('ENV TEST:', process.env.MONGO_URI);

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