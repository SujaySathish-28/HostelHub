const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    adminId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    },
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);