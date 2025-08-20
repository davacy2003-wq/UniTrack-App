const mongoose = require('mongoose');

const SessionCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    // This tells MongoDB to automatically delete the document 10 minutes after it's created.
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '10m', // TTL index: expires in 10 minutes
    },
});

module.exports = mongoose.model('SessionCode', SessionCodeSchema);