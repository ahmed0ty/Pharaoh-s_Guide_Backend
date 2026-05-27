import * as placesService from './places.service.js';

export const getAllPlaces = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const result = await placesService.getAllPlacesService({ page, limit, category, search });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPlaceById = async (req, res, next) => {
  try {
    const place = await placesService.getPlaceByIdService(req.params.id);
    res.status(200).json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedPlaces = async (req, res, next) => {
  try {
    const places = await placesService.getFeaturedPlacesService();
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    next(error);
  }
};

export const createPlace = async (req, res, next) => {
  try {
    const place = await placesService.createPlaceService(req.body);
    res.status(201).json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

export const seedPlaces = async (req, res, next) => {
  try {
    const result = await placesService.seedPlacesService();
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};