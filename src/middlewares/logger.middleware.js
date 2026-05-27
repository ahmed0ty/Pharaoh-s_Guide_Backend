const COLORS = {
  GET    : '\x1b[32m',  // أخضر
  POST   : '\x1b[34m',  // أزرق
  PUT    : '\x1b[33m',  // أصفر
  PATCH  : '\x1b[33m',
  DELETE : '\x1b[31m',  // أحمر
  RESET  : '\x1b[0m',
};

export const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const ms     = Date.now() - start;
    const color  = COLORS[req.method] || '';
    const status = res.statusCode;
    const emoji  = status >= 500 ? '💥' : status >= 400 ? '⚠️ ' : status >= 300 ? '↪️ ' : '✅';

    console.log(
      `${emoji}  ${color}${req.method}${COLORS.RESET} ${req.originalUrl} ` +
      `→ ${status} [${ms}ms] — ${req.ip}`
    );
  });

  next();
};