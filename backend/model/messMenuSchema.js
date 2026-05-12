const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => Date.now().toString(),
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Veg', 'Non-Veg'],
    default: 'Veg',
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
}, { _id: false });

const dayMenuSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  breakfast: {
    type: [mealItemSchema],
    default: [],
  },
  lunch: {
    type: [mealItemSchema],
    default: [],
  },
  snacks: {
    type: [mealItemSchema],
    default: [],
  },
  dinner: {
    type: [mealItemSchema],
    default: [],
  },
}, { _id: false });

const messMenuSchema = new mongoose.Schema({
  week: [dayMenuSchema],
  createdBy: {
    type: String,
    default: 'admin',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MessMenu', messMenuSchema);
