// import redis from '../config/redis.js';

// export const getCache = async (key) => {
//   const data = await redis.get(key);
//   return data ? JSON.parse(data) : null;
// };

// export const setCache = async (key, value, ttl = 3600) => {
//   await redis.set(key, JSON.stringify(value), 'EX', ttl);
// };

// export const deleteCache = async (key) => {
//   await redis.del(key);
// };

// export const clearCacheByPrefix = async (prefix) => {
//   const keys = await redis.keys(`${prefix}*`);
//   if (keys.length > 0) await redis.del(...keys);
// };

// // ── Cache-aside: لو مفيش → جيب من DB واحفظ ───────────────
// export const remember = async (key, ttl, fn) => {
//   const cached = await getCache(key);
//   if (cached) return cached;
//   const result = await fn();
//   await setCache(key, result, ttl);
//   return result;
// };


import redis from '../config/redis.js';

export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
  } catch {
    return null;
  }
};

export const setCache = async (key, value, ttl = 3600) => {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttl }); // Upstash syntax
  } catch {
    // ignore
  }
};

export const deleteCache = async (key) => {
  try {
    await redis.del(key);
  } catch {
    // ignore
  }
};

export const clearCacheByPrefix = async (prefix) => {
  try {
    const keys = await redis.keys(`${prefix}*`);
    if (keys && keys.length > 0) {
      // Upstash del بياخد array مش spread
      await Promise.all(keys.map(key => redis.del(key)));
    }
  } catch {
    // ignore
  }
};

export const remember = async (key, ttl, fn) => {
  const cached = await getCache(key);
  if (cached) return cached;
  const result = await fn();
  await setCache(key, result, ttl);
  return result;
};