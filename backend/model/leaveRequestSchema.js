const mongoose=require('mongoose');

const leaveSchema=new mongoose.Schema({
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
    addressOnLeave:{
        type:String,
        required:true,
    },
    reason:{
        type:String,
        required:true,
    },
    leaveType:{
        type:String,
        enum:['medical','home out','other'],
        required:true,
    },
    dateOfLeave:{
        type:String,
        required:true,
    },
    returnDate:{
        type:String,
        required:true,
    },
    studentMobile:{
        type:String,
        required:true,
    },
    parentMobile:{
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
    status:{
        type:String,
        enum:['pending','accepted','rejected','returned'],
        default:'pending'
    },
    rejectReason:{
        type:String,
    }

});

module.exports = mongoose.model('Leave-Request',leaveSchema);