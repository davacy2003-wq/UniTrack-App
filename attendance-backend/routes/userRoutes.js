const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    getAllUsers,
    deleteUser,
    updateUser 
} = require('../controllers/userController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// PUBLIC ROUTES
router.post('/login', loginUser);

// PROTECTED STUDENT ROUTE
router.get('/profile', protect, getUserProfile);

// PROTECTED ADMIN ROUTES
router.post('/register', protect, admin, registerUser);
router.get('/', protect, admin, getAllUsers);
// DELETE route
router.delete('/:id', protect, admin, deleteUser);

// Update User route
router.put('/:id', protect, admin, updateUser);

module.exports = router;