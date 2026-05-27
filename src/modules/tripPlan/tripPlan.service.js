import TripPlan from "../../DB/models/tripPlan.model.js";
import { generateTripPlanService } from "../../modules/ai/ai.service.js";
import {
  getCache,
  setCache,
  clearCacheByPrefix,
} from "../../utils/cache.util.js";

export const createTripPlanService = async (
  userId,
  { days, interests, budget, language },
) => {
  const aiPlan = await generateTripPlanService({
    days,
    interests,
    budget,
    language,
  });

  const tripPlan = await TripPlan.create({
    userId,
    title: aiPlan.title,
    overview: aiPlan.overview,
    days,
    interests,
    budget,
    language,
    plan: {
      days: aiPlan.days,
      totalBudget: aiPlan.totalBudget,
      bestSeason: aiPlan.bestSeason,
    },
  });

  await clearCacheByPrefix(`tripplans:${userId}`);
  return tripPlan;
};

export const getMyTripPlansService = async (userId) => {
  const cacheKey = `tripplans:${userId}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const plans = await TripPlan.find({ userId }).sort({ createdAt: -1 }).lean();

  await setCache(cacheKey, plans, 300);
  return plans;
};

export const getTripPlanByIdService = async (id, userId) => {
  const cacheKey = `tripplans:${userId}:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const plan = await TripPlan.findOne({ _id: id, userId }).lean();
  if (!plan) throw new Error("Trip plan not found");

  await setCache(cacheKey, plan, 300);
  return plan;
};

export const deleteTripPlanService = async (id, userId) => {
  const plan = await TripPlan.findOneAndDelete({ _id: id, userId });
  if (!plan) throw new Error("Trip plan not found");
  await clearCacheByPrefix(`tripplans:${userId}`);
  return plan;
};
