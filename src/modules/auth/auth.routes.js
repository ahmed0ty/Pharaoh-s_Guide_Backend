import { Router } from 'express';
import { upload } from '../../config/cloudinary.js';
import {
  register, confirmEmail, login,
  forgotPassword, resetPassword,
  refreshToken, logout,
} from './auth.controller.js';
import { authLimiter }           from '../../middlewares/rateLimiter.middleware.js';
import { validate, sanitize }    from '../../middlewares/validate.middleware.js';
import {
  registerSchema, confirmEmailSchema, loginSchema,
  forgotPasswordSchema, resetPasswordSchema,
} from './auth.validation.js';

const router = Router();

router.post('/register',        authLimiter, sanitize, upload.single('profileImage'), validate(registerSchema),        register);
router.post('/confirm-email',   authLimiter, sanitize, validate(confirmEmailSchema),  confirmEmail);
router.post('/login',           authLimiter, sanitize, validate(loginSchema),         login);
router.post('/forgot-password', authLimiter, sanitize, validate(forgotPasswordSchema),forgotPassword);
router.post('/reset-password',  authLimiter, sanitize, validate(resetPasswordSchema), resetPassword);
router.post('/refresh-token',   refreshToken);
router.post('/logout',          logout);

export default router;