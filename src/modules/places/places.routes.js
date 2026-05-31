import { Router } from 'express';
import {
  getAllPlaces, getPlaceById,
  getFeaturedPlaces, createPlace, seedPlaces,
} from './places.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: Egyptian landmarks endpoints
 */

/**
 * @swagger
 * /api/places/seed:
 *   get:
 *     summary: Seed database with Egyptian places
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: Places seeded successfully
 */
router.get('/seed', seedPlaces);

/**
 * @swagger
 * /api/places/featured:
 *   get:
 *     summary: Get featured places
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: List of featured places
 */
router.get('/featured', getFeaturedPlaces);

/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Get all places with pagination and filters
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: Pyramids
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Giza
 *     responses:
 *       200:
 *         description: List of places
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getAllPlaces);

/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Get place by ID
 *     tags: [Places]
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
 *         description: Place details
 *       404:
 *         description: Place not found
 */
router.get('/:id', protect, getPlaceById);

/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Create a new place
 *     tags: [Places]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, location, category]
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: The Great Pyramids
 *                   ar:
 *                     type: string
 *                     example: الأهرامات الكبرى
 *               category:
 *                 type: string
 *                 example: Pyramids
 *     responses:
 *       201:
 *         description: Place created successfully
 */
router.post('/', protect, createPlace);

export default router;