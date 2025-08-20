const express = require('express');
const router = express.Router();
const { 
    generateQRCode, 
    markAttendance, 
    getAttendanceRecords 
} = require('../controllers/attendanceController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.get('/generate/:id', protect, admin, generateQRCode);
router.post('/mark', protect, markAttendance);
router.get('/records', protect, admin, getAttendanceRecords);

module.exports = router;