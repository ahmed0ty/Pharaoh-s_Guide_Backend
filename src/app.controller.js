import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes     from './modules/auth/auth.routes.js';
import userRoutes     from './modules/user/user.routes.js';
import placesRoutes   from './modules/places/places.routes.js';
import aiRoutes       from './modules/ai/ai.routes.js';
import tripPlanRoutes from './modules/tripPlan/tripPlan.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.middleware.js';
import { logger }                 from './middlewares/logger.middleware.js';
import { globalLimiter }          from './middlewares/rateLimiter.middleware.js';
import swaggerUi       from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import adminRouter from './modules/admin/admin.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(globalLimiter);

// ── Swagger Docs ──────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/user',       userRoutes);
app.use('/api/places',     placesRoutes);
app.use('/api/ai',         aiRoutes);
app.use('/api/trip-plans', tripPlanRoutes);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
  res.json({ message: 'Egyptian Tourist API is running' });
});

app.use(notFound);
app.use(errorHandler);

export default app;