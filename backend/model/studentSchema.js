const mongoose=require('mongoose');

const studentSchema=new mongoose.Schema({
    studentID:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    branch:{
        type:String,
        enum:['CSE','ECE','AD','ML','ME','CE','EE'],
        required:true,
    },
    year:{
        type:String,
        enum:['1','2','3','4'],
        required:true,
    },
    roomNo:{
        type:String,
        required:true,
    },
    profilePhoto:{
        type:String,
        default: ''
    },
    totalFee: {
        type: Number,
        required: true,
        default: 0,
    },
    feePaid: {
        type: Number,
        required: true,
        default: 0,
    },
    feeDue: {
        type: Number,
        required: true,
        default: 0,
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    }
});

module.exports = mongoose.model('Student',studentSchema);