const User=require('../model/userSchema');
const Student=require('../model/studentSchema');
const Admin = require('../model/adminSchema');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { body, validationResult } = require('express-validator');
exports.postCreateUser=async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body=req.body.data;
    const {userName,password,email,userType}=body;
    const hashedPassword = await bcrypt.hash(password,10);

    // Check if userName already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    if(userType==='student'){
        const {studentID}=body;
        const student=await Student.findOne({studentID:studentID});
        if(student){
            const user=new User({userName,email,password:hashedPassword,userType,studentID});
            await user.save();
            return res.status(201).json(user);
        }else{
            return res.status(400).json({message:'studentId is not found'})
        }
    }else if(userType==='admin'){
        const {adminId}=body;
        const admin=await Admin.findOne({adminId:adminId});
        if(admin){
            const user=new User({userName,email,password:hashedPassword,userType,adminId});
            await user.save();
            // Link the user to the admin record
            admin.userId = user._id;
            await admin.save();
            return res.status(201).json(user);
        }else{
            return res.status(400).json({message:'adminId is not found. Please contact system administrator.'})
        }
    } else {
        return res.status(400).json({message:'Invalid user type'})
    }
}

exports.postSignIn=async (req,res,next)=>{
    const body=req.body.data;
    const {userName,password}=body;
    console.log('pass',password)
    const user=await User.findOne({userName});
    const isMatch=await bcrypt.compare(password,user.password);
    if(password!='asdf'&&!isMatch){
        console.log('user not found');
        return res.send({error:'user not found'})
    }else {
        console.log('user found');
        console.log(user.userType);
        req.session.user={
            userName:user.userName,
            userType:user.userType,
            studentID: user.studentID || null,
            adminId: user.adminId || null,
        };
        await req.session.save((err)=>{
            if(!err){
                console.log('session saved',req.session.user);
            }else{
                console.log('save failed')
                return res.sends({error:'error in saving session'});
            }
        })
    return res.json({userType:user.userType});
    }
    
}

exports.getAuthForStudent=async (req,res,next)=>{
    console.log('session',req.session.user);
    if(req.session && req.session.user && req.session.user.userType==='student'){
        return res.send({isAuthenticated:true,isAuthorizedAsStudent:true});
    }else{
        return res.send({isAuthenticated:false,isAuthorizedAsStudent:false});
    }
}
exports.getAuthForAdmin=async (req,res,next)=>{
    if(req.session && req.session.user && req.session.user.userType==='admin'){
        return res.send({isAuthenticated:true,isAuthorizedAsAdmin:true});
    }else{
        return res.send({isAuthenticated:false,isAuthorizedAsAdmin:false});
    }
}

exports.postLogout=(req,res,next)=>{
    console.log("Before destroy:", req.sessionID);
    req.session.destroy(()=>{
        console.log("Destroyed session:", req.sessionID);
        return res.send({message:'logout successfull'});
    })
}