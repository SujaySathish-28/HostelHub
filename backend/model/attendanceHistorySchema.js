const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  },
}, { _id: false });

const attendanceHistorySchema = new mongoose.Schema({
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
  studentAdmitedDate:{
    type:String,
  },
  attendanceCount:{
    type:Number,
  },
  attendanceHistory: {
    type: [attendanceRecordSchema],
    default: [],
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('AttendanceHistory', attendanceHistorySchema);
