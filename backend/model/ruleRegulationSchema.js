const mongoose = require('mongoose');

const ruleRegulationSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    enum: ['rule', 'regulation'],
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: String,
    default: 'admin',
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('RuleRegulation', ruleRegulationSchema);
