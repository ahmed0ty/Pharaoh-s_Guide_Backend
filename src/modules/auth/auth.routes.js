import { Router } from 'express';
import { upload } from '../../config/cloudinary.js';
import {
  register, confirmEmail, login,
  forgotPassword, resetPassword,
  refreshToken, logout,
} from './auth.controller.js';
import { authLimiter }           from '../../middlewares/rateLimiter.middleware.js';
import { validate, sanitize }    from '../../middlewares/validation.middleware.js';
import {
  registerSchema, confirmEmailSchema, loginSchema,
  forgotPasswordSchema, resetPasswordSchema,
} from './auth.validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Tony
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', authLimiter, upload.single('profileImage'), sanitize, validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/confirm-email:
 *   post:
 *     summary: Confirm email with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/confirm-email', authLimiter, sanitize, validate(confirmEmailSchema), confirmEmail);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', authLimiter, sanitize, validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User not found
 */
router.post('/forgot-password', authLimiter, sanitize, validate(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/reset-password', authLimiter, sanitize, validate(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Refresh token missing or invalid
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and clear refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', logout);

export default router;