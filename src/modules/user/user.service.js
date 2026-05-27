import User from "../../DB/models/user.model.js";
import {
  getCache,
  setCache,
  clearCacheByPrefix,
} from "../../utils/cache.util.js";

export const getMyProfileService = async (userId) => {
  const cacheKey = `users:${userId}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const user = await User.findById(userId)
    .select(
      "-password -refreshTokens -confirmEmailOTP -confirmEmailExpires -resetPasswordOTP -resetPasswordExpires",
    )
    .lean();

  if (!user) throw new Error("User not found");

  await setCache(cacheKey, user, 300);
  return user;
};

export const updateMyProfileService = async (userId, data) => {
  const allowedFields = ["name"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field]) updateData[field] = data[field];
  });

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select(
    "-password -refreshTokens -confirmEmailOTP -confirmEmailExpires -resetPasswordOTP -resetPasswordExpires",
  );

  if (!user) throw new Error("User not found");

  await clearCacheByPrefix("users:");
  return user;
};


export const updateProfileImageService = async (userId, imageUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { profileImage: imageUrl },
    { new: true }
  ).select(
    "-password -refreshTokens -confirmEmailOTP -confirmEmailExpires -resetPasswordOTP -resetPasswordExpires"
  );

  if (!user) throw new Error("User not found");

  await clearCacheByPrefix("users:");
  return user;
};