import { Router } from 'express';
import {
  generateTripPlan, getPlaceStory, chatWithGuide,
} from './ai.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-powered features
 */

/**
 * @swagger
 * /api/ai/trip-plan:
 *   post:
 *     summary: Generate AI trip plan
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [days, interests, budget]
 *             properties:
 *               days:
 *                 type: integer
 *                 example: 3
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Pyramids", "Temples"]
 *               budget:
 *                 type: number
 *                 example: 500
 *               language:
 *                 type: string
 *                 example: en
 *     responses:
 *       200:
 *         description: AI generated trip plan
 */
router.post('/trip-plan', protect, generateTripPlan);

/**
 * @swagger
 * /api/ai/story/{id}:
 *   get:
 *     summary: Get immersive story for a place
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID
 *     responses:
 *       200:
 *         description: AI generated story
 *       404:
 *         description: Place not found
 */
router.get('/story/:id', protect, getPlaceStory);

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI tour guide
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 example: Tell me about the pyramids
 *               language:
 *                 type: string
 *                 example: en
 *     responses:
 *       200:
 *         description: AI response
 */
router.post('/chat', protect, chatWithGuide);

export default router;