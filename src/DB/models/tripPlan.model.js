import mongoose from 'mongoose';

const tripPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  overview: { type: String, default: '' },
  days: { type: Number, required: true },
  interests: [{ type: String }],
  budget: { type: Number, required: true },
  language: { type: String, default: 'en' },
  plan: {
    days: [
      {
        day: Number,
        title: String,
        places: [String],
        description: String,
        tips: String,
      },
    ],
    totalBudget: String,
    bestSeason: String,
  },
}, { timestamps: true });

export default mongoose.model('TripPlan', tripPlanSchema);