const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
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
  targetStudentID: {
    type: String,
    default: '',
    trim: true,
  },
  targetStudentName: {
    type: String,
    required: true,
    trim: true,
  },
  targetRoomNo: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Alert', alertSchema);
