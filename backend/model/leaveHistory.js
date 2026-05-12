const mongoose = require('mongoose');

const leaveRecordSchema = new mongoose.Schema({
  outDate: {
    type: String,
    required: true,
  },
  inDate: {
    type: String,
    required: true,
  },
  addressWhileOnLeave: {
    type: String,
    required: true,
  },
}, { _id: false });

const leaveHistorySchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  roomNo:{
    type:String,
    required:true,
  },
  leaveHistory: {
    type: [leaveRecordSchema],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('LeaveHistory', leaveHistorySchema);