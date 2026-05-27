import * as tripPlanService from './tripPlan.service.js';

export const createTripPlan = async (req, res, next) => {
  try {
    const { days, interests, budget, language } = req.body;

    if (!days || !interests || !budget) {
      return res.status(400).json({
        message: 'days, interests, and budget are required',
      });
    }

    const plan = await tripPlanService.createTripPlanService(
      req.user._id,
      { days, interests, budget, language }
    );

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

export const getMyTripPlans = async (req, res, next) => {
  try {
    const plans = await tripPlanService.getMyTripPlansService(req.user._id);
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

export const getTripPlanById = async (req, res, next) => {
  try {
    const plan = await tripPlanService.getTripPlanByIdService(
      req.params.id,
      req.user._id
    );
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

export const deleteTripPlan = async (req, res, next) => {
  try {
    await tripPlanService.deleteTripPlanService(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: 'Trip plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};