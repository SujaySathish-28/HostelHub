const express=require('express');

const studentRouter=express.Router();
const studentController=require('../controllers/studentControllers');

studentRouter.post('/student-leave',studentController.postStudentLeave);
studentRouter.post('/student/complaint', studentController.postStudentComplaint);
studentRouter.get('/student/leave-status', studentController.getLeaveRequestStatus);
studentRouter.get('/student/leave-history', studentController.getStudentLeaveHistory);
studentRouter.get('/student/profile', studentController.getStudentProfile);
studentRouter.post('/student/change-password', studentController.changeStudentPassword);
studentRouter.post('/student/update-theme', studentController.updateStudentTheme);
studentRouter.get('/student/alerts', studentController.getStudentAlerts);
studentRouter.get('/student/attendance-stats', studentController.getStudentAttendanceStats);
studentRouter.get('/student/complaints', studentController.getStudentComplaints);
studentRouter.delete('/student/cancel-leave/:requestId', studentController.cancelLeaveRequest);
studentRouter.get('/student/mess-menu', studentController.getMessMenu);

// Forgot Password Routes
studentRouter.post('/student/forgot-password', studentController.forgotPassword);
studentRouter.post('/student/reset-password', studentController.resetPassword);
studentRouter.post('/student/verify-reset-token', studentController.verifyResetToken);

module.exports=studentRouter;