const express=require('express');

const hostelRouter=express.Router();
const hostelController=require('../controllers/hostelControllers');
const { body } = require('express-validator');

hostelRouter.post('/sign-up', [
    body('data.userName').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('data.email').isEmail().withMessage('Please provide a valid email'),
    body('data.password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('data.userType').isIn(['student', 'admin']).withMessage('Invalid user type'),
    body('data.studentID').if(body('data.userType').equals('student')).notEmpty().withMessage('Student ID is required for students'),
    body('data.adminId').if(body('data.userType').equals('admin')).notEmpty().withMessage('Admin ID is required for admins')
], hostelController.postCreateUser);
hostelRouter.post('/sign-in',hostelController.postSignIn);
hostelRouter.get('/auth-student',hostelController.getAuthForStudent);
hostelRouter.get('/auth-admin',hostelController.getAuthForAdmin);
hostelRouter.post('/logout',hostelController.postLogout);
module.exports=hostelRouter;