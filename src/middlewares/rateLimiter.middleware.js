import { getRedis } from '../utils/redis.util.js';
import { ApiResponse } from '../utils/apiResponse.util.js';

const createRateLimiter = ({ windowSec, max, keyPrefix, message }) => {
  return async (req, res, next) => {
    const ip  = req.ip || req.connection.remoteAddress;
    const key = `ratelimit:${keyPrefix}:${ip}`;

    try {
      const redis    = getRedis();
      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, windowSec);
      }

      res.setHeader('X-RateLimit-Limit',     max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - requests));

      if (requests > max) {
        const ttl = await redis.ttl(key);
        res.setHeader('Retry-After', ttl);
        return ApiResponse.error(res, message, 429);
      }

      next();
    } catch (err) {
      logger.error('Rate limiter error:', err.message);
      next();
    }
  };
};

export const globalLimiter = createRateLimiter({
  windowSec: 60,
  max      : 100,
  keyPrefix: 'global',
  message  : 'Too many requests, please slow down',
});

export const authLimiter = createRateLimiter({
  windowSec: 15 * 60,
  max      : 10,
  keyPrefix: 'auth',
  message  : 'Too many login attempts, try again in 15 minutes',
});

export const searchLimiter = createRateLimiter({
  windowSec: 60,
  max      : 30,
  keyPrefix: 'search',
  message  : 'Too many search requests',
});