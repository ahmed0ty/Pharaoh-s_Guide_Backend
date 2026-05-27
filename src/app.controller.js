// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import authRoutes from './modules/auth/auth.routes.js';
// import userRoutes from './modules/user/user.routes.js';
// import placesRoutes from './modules/places/places.routes.js';
// import aiRoutes from './modules/ai/ai.routes.js';
// import tripPlanRoutes from './modules/tripPlan/tripPlan.routes.js';
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/places', placesRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/trip-plans', tripPlanRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: 'Egyptian Tourist API is running 🎉' });
// });

// export default app;



import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes     from './modules/auth/auth.routes.js';
import userRoutes     from './modules/user/user.routes.js';
import placesRoutes   from './modules/places/places.routes.js';
import aiRoutes       from './modules/ai/ai.routes.js';
import tripPlanRoutes from './modules/tripPlan/tripPlan.routes.js';

import { errorHandler, notFound } from './middlewares/errorHandler.middleware.js';
import { logger }                 from './middlewares/logger.middleware.js';
import { globalLimiter }          from './middlewares/rateLimiter.middleware.js';

const app = express();

app.use(cors({
  origin     : process.env.CLIENT_URL || '*',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(globalLimiter);

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/user',       userRoutes);
app.use('/api/places',     placesRoutes);
app.use('/api/ai',         aiRoutes);
app.use('/api/trip-plans', tripPlanRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Egyptian Tourist API is running 🎉' });
});

// ── Error handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;