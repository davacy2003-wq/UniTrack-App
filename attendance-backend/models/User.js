const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  matricNumber: {
    type: String,
    required: true,
    unique: true, // No two students can have the same matric number
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true, // We will store the hashed password here
  },
  role: {
    type: String,
    enum: ['student', 'admin'], // The role must be one of these two values
    default: 'student',
  },
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('User', UserSchema);