const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    userName:{type:String,required:true},
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type:String,
        required:true,
        minlength:2,
    },
    userType:{
        type:String,
        required:true,
    },
    studentID:{
        type:String,
        required:function (){
            return this.userType==='student'
        },
    },
    adminId:{
        type:String,
        required:function (){
            return this.userType==='admin'
        },
    },
    resetPasswordToken:{
        type:String,
        default:null,
    },
    resetPasswordExpires:{
        type:Date,
        default:null,
    },
});

module.exports = mongoose.model('User',userSchema);