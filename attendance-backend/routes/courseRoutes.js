const express = require('express');
const router = express.Router();
const { 
    createCourse, 
    getAllCourses, 
    getMyEnrolledCourses, 
    enrollStudentInCourse,
    deleteCourse,
    updateCourse,
    unenrollStudentFromCourse

} = require('../controllers/courseController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// Admin routes
router.route('/')
    .post(protect, admin, createCourse)
    .get(protect, admin, getAllCourses);

router.post('/:id/enroll', protect, admin, enrollStudentInCourse);

// Student route
router.get('/mycourses', protect, getMyEnrolledCourses);

// Delete Course route
router.delete('/:id', protect, admin, deleteCourse);

// Update Course route
router.put('/:id', protect, admin, updateCourse);

// Unenroll Student from Course route
router.post('/:id/unenroll', protect, admin, unenrollStudentFromCourse);

module.exports = router;