import User from '../../DB/models/user.model.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 });
    return ApiResponse.success(res, 'Users fetched', {
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return ApiResponse.notFound(res, 'User not found');
    return ApiResponse.success(res, 'User deleted');
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return ApiResponse.notFound(res, 'User not found');
    if (user.role === 'admin') return ApiResponse.forbidden(res, 'Cannot block admin');
    user.isActive = !user.isActive;
    await user.save();
    return ApiResponse.success(res, user.isActive ? 'User activated' : 'User deactivated', {
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const blockedUsers = await User.countDocuments({ role: 'user', isActive: false });
    const confirmedUsers = await User.countDocuments({ role: 'user', isConfirmed: true });
    return ApiResponse.success(res, 'Stats fetched', {
      totalUsers,
      blockedUsers,
      confirmedUsers,
    });
  } catch (error) {
    next(error);
  }
};