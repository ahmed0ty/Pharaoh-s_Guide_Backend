import * as userService from './user.service.js';
import { getIO } from '../../socket.js';
import User from '../../DB/models/user.model.js';
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getMyProfileService(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await userService.updateMyProfileService(req.user._id, req.body);

    const io = getIO();
    io.to(`user_${req.user._id}`).emit('profile:updated', { user });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


export const addToFavorites = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: req.params.placeId } },
      { new: true }
    ).select('favorites');
    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: req.params.placeId } },
      { new: true }
    ).select('favorites');
    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    next(error);
  }
};

export const getMyFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites')
      .select('favorites');
    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    next(error);
  }
};


export const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const imageUrl = req.file.path; // Cloudinary URL
    const user = await userService.updateProfileImageService(req.user._id, imageUrl);

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};