// import * as aiService from './ai.service.js';

// export const generateTripPlan = async (req, res, next) => {
//   try {
//     const { days, interests, budget, language } = req.body;

//     if (!days || !interests || !budget) {
//       return res.status(400).json({
//         message: 'days, interests, and budget are required',
//       });
//     }

//     const tripPlan = await aiService.generateTripPlanService({
//       days,
//       interests,
//       budget,
//       language,
//     });

//     res.status(200).json({ success: true, data: tripPlan });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getPlaceStory = async (req, res, next) => {
//   try {
//     const { language } = req.query;
//     const result = await aiService.getPlaceStoryService({
//       placeId: req.params.id,
//       language,
//     });
//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     next(error);
//   }
// };

// export const chatWithGuide = async (req, res, next) => {
//   try {
//     const { message, language } = req.body;

//     if (!message) {
//       return res.status(400).json({ message: 'message is required' });
//     }

//     const result = await aiService.chatWithGuideService({ message, language });
//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     next(error);
//   }
// };






import * as aiService from './ai.service.js';

export const generateTripPlan = async (req, res, next) => {
  try {
    const { days, interests, budget, language } = req.body;

    if (!days || !interests || !budget) {
      return res.status(400).json({
        message: 'days, interests, and budget are required',
      });
    }

    const tripPlan = await aiService.generateTripPlanService({
      days,
      interests,
      budget,
      language,
    });

    res.status(200).json({ success: true, data: tripPlan });
  } catch (error) {
    next(error);
  }
};

export const getPlaceStory = async (req, res, next) => {
  try {
    const { language } = req.query;
    const result = await aiService.getPlaceStoryService({
      placeId: req.params.id,
      language,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.message?.includes("All AI models")) {
      return res.status(503).json({
        success: false,
        message: error.message,
        retryable: true,
      });
    }
    next(error);
  }
};

export const chatWithGuide = async (req, res, next) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'message is required' });
    }

    const result = await aiService.chatWithGuideService({ message, language });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};