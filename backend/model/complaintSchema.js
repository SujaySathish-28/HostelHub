const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'AD', 'ML', 'ME', 'CE', 'EE'],
    required: true,
  },
  year: {
    type: String,
    enum: ['1', '2', '3', '4'],
    required: true,
  },
  roomNo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  attachmentName: {
    type: String,
    default: '',
  },
  attachmentProvided: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'closed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Complaint', complaintSchema);
