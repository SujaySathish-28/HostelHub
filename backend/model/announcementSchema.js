const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['General', 'Maintenance', 'Event', 'Academic', 'Emergency', 'Other'],
    default: 'General',
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

module.exports = mongoose.model('Announcement', announcementSchema);
