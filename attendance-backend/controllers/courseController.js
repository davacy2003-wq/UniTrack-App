const Course = require('../models/Course.js');
const User = require('../models/User.js');

const createCourse = async (req, res) => {
  const { courseCode, courseTitle } = req.body;
  try {
    const courseExists = await Course.findOne({ courseCode });
    if (courseExists) return res.status(400).json({ message: 'Course with this code already exists' });
    const course = new Course({ courseCode, courseTitle });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getMyEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user._id });
    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const enrollStudentInCourse = async (req, res) => {
  const { studentId } = req.body;
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId);
    const student = await User.findById(studentId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.role !== 'student') return res.status(400).json({ message: 'Only students can be enrolled.' });
    if (course.studentsEnrolled.includes(studentId)) return res.status(400).json({ message: 'Student already enrolled.' });
    course.studentsEnrolled.push(studentId);
    await course.save();
    res.json({ message: 'Student enrolled successfully', course });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Note: In a real-world app, you might also want to delete associated attendance records.
        await Course.findByIdAndDelete(req.params.id);

        res.json({ message: 'Course removed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            course.courseCode = req.body.courseCode || course.courseCode;
            course.courseTitle = req.body.courseTitle || course.courseTitle;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Un-enroll a student from a course
// @route   POST /api/courses/:id/unenroll
// @access  Private/Admin
const unenrollStudentFromCourse = async (req, res) => {
    const { studentId } = req.body;
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Use $pull to remove the studentId from the studentsEnrolled array
        course.studentsEnrolled.pull(studentId);
        await course.save();

        res.json({ message: 'Student un-enrolled successfully', course });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { createCourse, getAllCourses, getMyEnrolledCourses, enrollStudentInCourse, deleteCourse, updateCourse, unenrollStudentFromCourse };