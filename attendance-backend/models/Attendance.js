const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // A reference to the student who signed in
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // A reference to the course for the session
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present',
  },
}, {
  timestamps: true, // The 'createdAt' field will act as the sign-in time
});

module.exports = mongoose.model('Attendance', AttendanceSchema);