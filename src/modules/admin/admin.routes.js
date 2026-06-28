import { Router } from 'express';
import { getAllUsers, deleteUser, toggleBlockUser, getStats } from './admin.controller.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/users', getAllUsers);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/block', toggleBlockUser);

export default router;