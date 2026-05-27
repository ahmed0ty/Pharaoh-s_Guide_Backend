import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  story: {
    en: { type: String, default: '' },
    ar: { type: String, default: '' },
  },
  location: {
    city: { type: String, required: true },
    governorate: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  category: {
    type: String,
    enum: ['Pyramids', 'Temples', 'Museums', 'Tombs', 'Monuments'],
    required: true,
  },
  images: [{ type: String }],
  bestTimeToVisit: { type: String, default: '' },
  entryFee: {
    egyptian: { type: Number, default: 0 },
    foreign: { type: Number, default: 0 },
  },
  openingHours: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Place', placeSchema);