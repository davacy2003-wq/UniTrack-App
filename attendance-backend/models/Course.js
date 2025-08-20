const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  // This field will store a list of all students enrolled in the course
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This creates a link to the User model
  }],
  // We will add the timetable details here later
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', CourseSchema);