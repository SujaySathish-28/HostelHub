const LeaveRequest=require('../model/leaveRequestSchema');
const LeaveHistory = require('../model/leaveHistory');
const Student=require('../model/studentSchema');
const User=require('../model/userSchema');
const Complaint=require('../model/complaintSchema');
const Alert = require('../model/alertSchema');
const Attendance = require('../model/attendanceSchema');
const AttendanceHistory = require('../model/attendanceHistorySchema');
const MessMenu = require('../model/messMenuSchema');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendForgotPasswordEmail, sendPasswordResetConfirmation } = require('../utils/emailService');

exports.postStudentLeave=async (req,res,next)=>{
    const {studentID,address,leaveDate,reason,returnDate,studentMobile,parentMobile,leaveType}=req.body.data;
    const student=await Student.findOne({studentID})
    console.log(student);
    const leave={
        studentID,
        addressOnLeave:address,
        dateOfLeave:leaveDate,
        reason,
        returnDate,
        studentMobile,
        parentMobile,
        leaveType,
        firstName:student.firstName,
        lastName:student.lastName,
        branch:student.branch,
        year:student.year,
        roomNo:student.roomNo,
        status:'pending'
    }
    const leaveRequest=new LeaveRequest(leave);
    const resp=await leaveRequest.save();
    console.log(resp)
    res.status(201).json(resp);
}

exports.postStudentComplaint = async (req, res, next) => {
    try {
        const { category, complaint, reason, attachmentName, attachmentProvided } = req.body;
        const user1 = req.session?.user;
        const user2=await User.findOne({userName:user1.userName});
        console.log(user1, user2)
        if (!user1 || user1.userType !== 'student') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const student = await Student.findOne({ studentID: user2.studentID });
        if (!student) {
            return res.status(404).json({ message: 'Student record not found' });
        }

        const complaintData = {
            studentID: user2.studentID,
            firstName: student.firstName,
            lastName: student.lastName,
            branch: student.branch,
            year: student.year,
            roomNo: student.roomNo,
            category,
            complaint,
            reason,
            attachmentName: attachmentName || '',
            attachmentProvided: Boolean(attachmentProvided),
        };

        const savedComplaint = await new Complaint(complaintData).save();
        return res.status(201).json({ message: 'Complaint recorded successfully', complaint: savedComplaint });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to save complaint', error: err.message });
    }
}

exports.getLeaveRequestStatus=async (req,res,next)=>{
    const { studentID } = req.query;
    if (!studentID) {
        return res.status(400).json({ message: 'Missing studentID' });
    }
    const resp = await LeaveRequest.find({ studentID });
    console.log(resp);
    return res.json(resp);
}

exports.getStudentProfile=async (req,res,next)=>{
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.session.user.userType !== 'student') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userName = req.session.user.userName;
    const user = await User.findOne({ userName });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const student = await Student.findOne({ studentID: user.studentID });
    const totalFee = Number(student?.totalFee || 0);
    const feePaid = Number(student?.feePaid || 0);
    const feeDue = Number(student?.feeDue ?? Math.max(totalFee - feePaid, 0));
    return res.json({
        userName: user.userName,
        email: user.email,
        userType: user.userType,
        studentID: user.studentID,
        firstName: student?.firstName || '',
        lastName: student?.lastName || '',
        address: student?.address || '',
        branch: student?.branch || '',
        year: student?.year || '',
        roomNo: student?.roomNo || '',
        profilePhoto: student?.profilePhoto || '',
        totalFee,
        feePaid,
        feeDue,
        theme: student?.theme || 'light',
    });
}

exports.changeStudentPassword = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.session.user.userType !== 'student') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All password fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        const userName = req.session.user.userName;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ message: 'Error updating password', error: error.message });
    }
}

exports.updateStudentTheme = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.session.user.userType !== 'student') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { theme } = req.body;
        if (!theme || !['light', 'dark'].includes(theme)) {
            return res.status(400).json({ message: 'Invalid theme. Must be "light" or "dark"' });
        }

        const userName = req.session.user.userName;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const student = await Student.findOne({ studentID: user.studentID });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.theme = theme;
        await student.save();

        return res.status(200).json({ message: 'Theme updated successfully', theme });
    } catch (error) {
        console.error('Update theme error:', error);
        return res.status(500).json({ message: 'Error updating theme', error: error.message });
    }
}

exports.cancelLeaveRequest=async (req,res,next)=>{
    const { requestId } = req.params;
    if (!requestId) {
        return res.status(400).json({ message: 'Missing requestId' });
    }
    try {
        const leaveRequest = await LeaveRequest.findByIdAndDelete(requestId);
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.json({ message: 'Leave request cancelled successfully', leaveRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling leave request', error });
    }
}

exports.getStudentAlerts = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.session.user.userType !== 'student') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const alerts = await Alert.find().sort({ createdAt: -1 }).lean();
    res.json(alerts);
}

exports.getStudentLeaveHistory = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.session.user.userType !== 'student') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userName = req.session.user.userName;
    const user = await User.findOne({ userName });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const studentID = user.studentID;
    if (!studentID) {
        return res.status(400).json({ message: 'Student ID not found for user' });
    }

    const history = await LeaveHistory.findOne({ studentID }).lean();
    if (!history) {
        return res.json({ studentID, leaveHistory: [] });
    }
    return res.json(history);
}

exports.getStudentAttendanceStats = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.session.user.userType !== 'student') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userName = req.session.user.userName;
    const user = await User.findOne({ userName });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const studentID = user.studentID;
    if (!studentID) {
        return res.status(400).json({ message: 'Student ID not found for user' });
    }

    const attendanceHistory = await AttendanceHistory.findOne({ studentID }).lean();
    let totalDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let attendancePercentage = 0;
    let admittedDate = null;

    if (attendanceHistory) {
        totalDays = Array.isArray(attendanceHistory.attendanceHistory) ? attendanceHistory.attendanceHistory.length : 0;
        presentDays = typeof attendanceHistory.attendanceCount === 'number'
            ? attendanceHistory.attendanceCount
            : attendanceHistory.attendanceHistory.filter(record => record.status === 'present').length;
        absentDays = Math.max(totalDays - presentDays, 0);
        attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        admittedDate = attendanceHistory.studentAdmitedDate || attendanceHistory.createdAt;
    } else {
        const attendanceRecords = await Attendance.find({ studentID }).sort({ dateString: -1 });
        totalDays = attendanceRecords.length;
        presentDays = attendanceRecords.filter(record => record.status === 'present').length;
        absentDays = totalDays - presentDays;
        attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    }

    res.json({
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage,
        admittedDate,
    });
}

exports.getStudentComplaints = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.session.user.userType !== 'student') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userName = req.session.user.userName;
    const user = await User.findOne({ userName });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const studentID = user.studentID;
    if (!studentID) {
        return res.status(400).json({ message: 'Student ID not found for user' });
    }

    const complaints = await Complaint.find({ studentID }).sort({ createdAt: -1 });
    res.json(complaints);
}

// Forgot Password Handler
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists in database for security
            return res.status(200).json({ message: 'If email exists, a password reset link will be sent' });
        }

        // Check if user is a student
        if (user.userType !== 'student') {
            return res.status(400).json({ message: 'This email is not associated with a student account' });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token and expiry to database
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();

        // Create reset link
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        // Send email
        await sendForgotPasswordEmail(email, resetLink, user.userName);

        return res.status(200).json({ 
            message: 'Password reset email sent successfully',
            email: email 
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ message: 'Error processing forgot password request', error: error.message });
    }
};

// Reset Password Handler
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, email, newPassword, confirmPassword } = req.body;

        if (!token || !email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify reset token
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        
        if (user.resetPasswordToken !== resetTokenHash) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Check if token has expired
        if (new Date() > user.resetPasswordExpires) {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            return res.status(400).json({ message: 'Reset token has expired. Please request a new one' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Send confirmation email
        await sendPasswordResetConfirmation(email, user.userName);

        return res.status(200).json({ 
            message: 'Password reset successfully. You can now login with your new password' 
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};

// Verify Reset Token
exports.verifyResetToken = async (req, res, next) => {
    try {
        const { token, email } = req.body;

        if (!token || !email) {
            return res.status(400).json({ valid: false, message: 'Token and email are required' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ valid: false, message: 'User not found' });
        }

        // Verify reset token
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        
        if (user.resetPasswordToken !== resetTokenHash) {
            return res.status(400).json({ valid: false, message: 'Invalid reset token' });
        }

        // Check if token has expired
        if (new Date() > user.resetPasswordExpires) {
            return res.status(400).json({ valid: false, message: 'Reset token has expired' });
        }

        return res.status(200).json({ 
            valid: true, 
            message: 'Token is valid',
            userName: user.userName 
        });
    } catch (error) {
        console.error('Verify reset token error:', error);
        return res.status(500).json({ valid: false, message: 'Error verifying token', error: error.message });
    }
};


exports.getMessMenu = async (req, res, next) => {
    try {
        let menu = await MessMenu.findOne();
        if (!menu) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            menu = await MessMenu.create({
                week: days.map(day => ({
                    day,
                    breakfast: [],
                    lunch: [],
                    snacks: [],
                    dinner: []
                }))
            });
        }
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error fetching mess menu:', error);
        res.status(500).json({ message: 'Error fetching mess menu', error: error.message });
    }
};
