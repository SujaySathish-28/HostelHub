const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  },
  dateString: {
    type: String,
    required: true,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

attendanceSchema.index({ studentID: 1, dateString: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
