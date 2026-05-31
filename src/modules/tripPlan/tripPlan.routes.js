import { Router } from 'express';
import {
  createTripPlan, getMyTripPlans,
  getTripPlanById, deleteTripPlan,
} from './tripPlan.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TripPlan
 *   description: AI-powered trip planning
 */

/**
 * @swagger
 * /api/trip-plans:
 *   post:
 *     summary: Generate a new AI trip plan
 *     tags: [TripPlan]
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
 *       201:
 *         description: Trip plan generated successfully
 */
router.post('/', protect, createTripPlan);

/**
 * @swagger
 * /api/trip-plans:
 *   get:
 *     summary: Get my trip plans
 *     tags: [TripPlan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trip plans
 */
router.get('/', protect, getMyTripPlans);

/**
 * @swagger
 * /api/trip-plans/{id}:
 *   get:
 *     summary: Get trip plan by ID
 *     tags: [TripPlan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip plan details
 *       404:
 *         description: Trip plan not found
 */
router.get('/:id', protect, getTripPlanById);

/**
 * @swagger
 * /api/trip-plans/{id}:
 *   delete:
 *     summary: Delete a trip plan
 *     tags: [TripPlan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip plan deleted successfully
 *       404:
 *         description: Trip plan not found
 */
router.delete('/:id', protect, deleteTripPlan);

export default router;