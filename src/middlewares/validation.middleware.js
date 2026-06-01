import { ApiResponse } from '../utils/apiResponse.util.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  const data = req[source];

  // ── Joi ──
  if (typeof schema.validate === 'function') {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map((d) => ({
        field  : d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));
      return ApiResponse.validationError(res, errors);
    }
    return next();
  }

  // ── Zod ──
  if (typeof schema.safeParse === 'function') {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field  : e.path.join('.'),
        message: e.message,
      }));
      return ApiResponse.validationError(res, errors);
    }
    req[source] = result.data;
    return next();
  }

  next();
};

export const sanitize = (req, res, next) => {
  const emailFields = ['email'];

  const clean = (obj) => {
    if (typeof obj !== 'object' || !obj) return obj;
    for (const key of Object.keys(obj)) {
      if (emailFields.includes(key)) continue;
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/</g,  '&lt;')
          .replace(/>/g,  '&gt;')
          .replace(/"/g,  '&quot;')
          .replace(/'/g,  '&#x27;')
          .replace(/\//g, '&#x2F;');
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
    return obj;
  };

  clean(req.body);
  clean(req.query);
  next();
};