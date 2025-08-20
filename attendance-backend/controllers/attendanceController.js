const qrcode = require('qrcode');
const crypto = require('crypto');
const Course = require('../models/Course.js');
const Attendance = require('../models/Attendance.js');
const SessionCode = require('../models/SessionCode.js');

// Helper function to generate a random, 6-character alphanumeric code
function generateShortCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// @desc    Generate a QR code for a course session
// @route   GET /api/attendance/generate/:id
// @access  Private/Admin
const generateQRCode = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const shortCode = generateShortCode();
    await SessionCode.create({ code: shortCode, course: courseId });
    
    const qrCodeDataURL = await qrcode.toDataURL(shortCode);
    res.json({ qrCode: qrCodeDataURL });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Mark attendance by scanning a QR code
// @route   POST /api/attendance/mark
// @access  Private/Student
const markAttendance = async (req, res) => {
  const { qrCodeData } = req.body;
  const studentId = req.user._id;

  try {
    const sessionCode = await SessionCode.findOne({ code: qrCodeData });
    if (!sessionCode) {
        return res.status(401).json({ message: 'QR Code is invalid or has expired.' });
    }
    const courseId = sessionCode.course;
    const course = await Course.findById(courseId);
    if (!course || !course.studentsEnrolled.includes(studentId)) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      course: courseId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this course today.' });
    }

    const attendance = await Attendance.create({
      student: studentId,
      course: courseId,
    });

    await SessionCode.deleteOne({ _id: sessionCode._id });
    res.status(201).json({ message: 'Attendance marked successfully!', attendance });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all attendance records, with optional filtering
// @route   GET /api/attendance/records
// @access  Private/Admin
const getAttendanceRecords = async (req, res) => {
    try {
        const filter = {};
        if (req.query.courseId) {
            filter.course = req.query.courseId;
        }

        const records = await Attendance.find(filter)
            .sort({ createdAt: -1 })
            .populate('student', 'name matricNumber')
            .populate('course', 'courseCode courseTitle');

        res.json(records);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// This export now correctly includes all three functions
module.exports = { generateQRCode, markAttendance, getAttendanceRecords };