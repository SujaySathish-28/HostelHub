const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    default: '',
  },
  createdBy: {
    type: String,
    default: 'admin',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notice', noticeSchema);
