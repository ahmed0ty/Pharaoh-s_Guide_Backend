import { Router } from 'express';
import {
  createTripPlan,
  getMyTripPlans,
  getTripPlanById,
  deleteTripPlan,
} from './tripPlan.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', protect, createTripPlan);
router.get('/', protect, getMyTripPlans);
router.get('/:id', protect, getTripPlanById);
router.delete('/:id', protect, deleteTripPlan);

export default router;