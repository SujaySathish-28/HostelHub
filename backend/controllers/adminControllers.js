const Student=require('../model/studentSchema');
const LeaveRequest=require('../model/leaveRequestSchema');
const LeaveHistory = require('../model/leaveHistory');
const Complaint = require('../model/complaintSchema');
const Attendance = require('../model/attendanceSchema');
const AttendanceHistory = require('../model/attendanceHistorySchema');
const Notice = require('../model/noticeSchema');
const Alert = require('../model/alertSchema');
const RuleRegulation = require('../model/ruleRegulationSchema');
const Admin = require('../model/adminSchema');
const User = require('../model/userSchema');
const MessMenu = require('../model/messMenuSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const buildRoomOrder = () => {
    const segments = [
        ['A', 1, 10],
        ['B', 11, 20],
        ['C', 21, 30],
        ['D', 31, 40],
        ['A', 41, 50],
        ['B', 51, 60],
        ['C', 61, 70],
        ['D', 71, 80],
        ['A', 81, 90],
        ['B', 91, 100],
        ['D', 101, 110],
    ];

    return segments.flatMap(([prefix, start, end]) => {
        return Array.from({ length: end - start + 1 }, (_, index) => {
            const num = (start + index).toString().padStart(3, '0');
            return `${prefix}${num}`;
        });
    });
};

const normalizeRoomNo = (roomNo) => {
    if (!roomNo || typeof roomNo !== 'string') return '';
    const normalized = roomNo.trim().toUpperCase();
    const match = normalized.match(/^([A-Z]+)\s*(\d+)$/);
    if (!match) return normalized;
    const prefix = match[1];
    const number = match[2].padStart(3, '0');
    return `${prefix}${number}`;
};

const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
};

exports.postAdmitStudent=async (req,res,next)=>{
    const {studentID,firstName,lastName,address,branch,year,roomNo,profilePhoto='',totalFee='0',feePaid='0'}=req.body.data;
    const normalizedRoomNo = normalizeRoomNo(roomNo);
    const parsedTotalFee = Number(totalFee) || 0;
    const parsedFeePaid = Number(feePaid) || 0;
    const feeDue = Math.max(parsedTotalFee - parsedFeePaid, 0);
    const student=new Student({
        studentID,
        firstName,
        lastName,
        address,
        branch,
        year,
        roomNo: normalizedRoomNo,
        profilePhoto,
        totalFee: parsedTotalFee,
        feePaid: parsedFeePaid,
        feeDue,
    });
    await student.save();
    return res.json({message:'success'});
}

exports.getLeaveRequests=async (req,res,next)=>{
    const resp=await LeaveRequest.find();
    res.send(resp);
}

exports.getStudentComplaints=async (req,res,next)=>{
    const complaints = await Complaint.find({ status: { $ne: 'completed' } }).sort({ createdAt: -1 });
    res.json(complaints);
}

exports.markComplaintCompleted = async (req,res,next)=>{
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Missing complaint id' });
    }

    const updated = await Complaint.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
    if (!updated) {
        return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint marked completed', complaint: updated });
}

exports.getAttendanceStudentList = async (req, res, next) => {
    const roomOrder = buildRoomOrder();
    const students = await Student.find().lean();
    const admittedStudents = students
        .map((student) => ({ ...student, roomNo: normalizeRoomNo(student.roomNo) }))
        .filter((student) => roomOrder.includes(student.roomNo));

    const attendanceRecords = await Attendance.find({
        studentID: { $in: admittedStudents.map((student) => student.studentID) },
        dateString: getTodayDateString(),
    }).lean();

    const attendanceByStudent = attendanceRecords.reduce((acc, record) => {
        acc[record.studentID] = record;
        return acc;
    }, {});

    const studentByRoom = admittedStudents.reduce((acc, student) => {
        acc[student.roomNo] = acc[student.roomNo] || [];
        acc[student.roomNo].push(student);
        return acc;
    }, {});

    const sortedStudents = roomOrder.reduce((list, roomNo) => {
        const studentsInRoom = studentByRoom[roomNo] || [];
        studentsInRoom.sort((a, b) => a.studentID.localeCompare(b.studentID));
        list.push(...studentsInRoom);
        return list;
    }, []);

    const result = sortedStudents.map((student) => ({
        roomNo: student.roomNo,
        studentID: student.studentID,
        firstName: student.firstName,
        lastName: student.lastName,
        status: attendanceByStudent[student.studentID]?.status || 'absent',
    }));

    res.json(result);
};

exports.saveAttendanceRecords = async (req, res, next) => {
    const { attendance } = req.body;
    if (!Array.isArray(attendance) || attendance.some((item) => !item.studentID || !['present', 'absent'].includes(item.status))) {
        return res.status(400).json({ message: 'Invalid attendance payload' });
    }

    const dateString = getTodayDateString();
    const ops = attendance.map((item) => ({
        updateOne: {
            filter: { studentID: item.studentID, dateString },
            update: { $set: { studentID: item.studentID, status: item.status, dateString, recordedAt: new Date() } },
            upsert: true,
        },
    }));

    if (ops.length > 0) {
        await Attendance.bulkWrite(ops);

        const studentRecords = await Student.find({ studentID: { $in: attendance.map((item) => item.studentID) } }).lean();
        const studentMap = studentRecords.reduce((map, student) => {
            map[student.studentID] = student;
            return map;
        }, {});

        for (const item of attendance) {
            const student = studentMap[item.studentID] || {};
            const name = [student.firstName, student.lastName].filter(Boolean).join(' ').trim();

            const historyDoc = await AttendanceHistory.findOne({ studentID: item.studentID });
            if (!historyDoc) {
                await AttendanceHistory.create({
                    studentID: item.studentID,
                    name: name || '',
                    class: student.class || '',
                    studentAdmitedDate:new Date(),
                    attendanceCount:item.status=='present',
                    attendanceHistory: [{ date: dateString, status: item.status }],
                });
                continue;
            }

            historyDoc.name = name || historyDoc.name || '';
            historyDoc.class = student.class || historyDoc.class || '';
            historyDoc.attendanceHistory = historyDoc.attendanceHistory.filter((record) => record.date !== dateString);
            historyDoc.attendanceHistory.push({ date: dateString, status: item.status });
            if(item.status=='present'){
                historyDoc.attendanceCount+=1;
            }
            await historyDoc.save();
        }
    }

    res.json({ message: 'Attendance saved successfully' });
}

exports.getUpdateLeaveRequestStatus=async (req,res,next)=>{
    const { studentID, requestId, status, reason } = req.query;
    console.log(studentID, requestId, status, reason);

    if (!status || (!studentID && !requestId)) {
        return res.status(400).json({ message: 'Missing studentID or requestId, or missing status' });
    }

    const filter = requestId ? { _id: requestId } : { studentID };

    if (status === 'returned') {
        const leaveRequest = await LeaveRequest.findOneAndUpdate(filter, { $set: { status, rejectReason: 'NA' } }, { new: true });
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        const record = {
            outDate: leaveRequest.dateOfLeave,
            inDate: leaveRequest.returnDate,
            addressWhileOnLeave: leaveRequest.addressOnLeave,
        };

        let historyDoc = await LeaveHistory.findOne({ studentID: leaveRequest.studentID });
        if (!historyDoc) {
            historyDoc = await LeaveHistory.create({
                studentID: leaveRequest.studentID,
                name: `${leaveRequest.firstName} ${leaveRequest.lastName}`.trim(),
                class: leaveRequest.branch || '',
                roomNo: leaveRequest.roomNo || '',
                leaveHistory: [record],
            });
        } else {
            historyDoc.leaveHistory = historyDoc.leaveHistory.filter(
                (item) => item.outDate !== record.outDate || item.inDate !== record.inDate
            );
            historyDoc.leaveHistory.push(record);
            historyDoc.name = historyDoc.name || `${leaveRequest.firstName} ${leaveRequest.lastName}`.trim();
            historyDoc.class = historyDoc.class || leaveRequest.branch || '';
            historyDoc.roomNo = historyDoc.roomNo || leaveRequest.roomNo || '';
            await historyDoc.save();
        }

        return res.send({ message: 'Leave request marked returned and saved to leave history' });
    }

    const update = reason === 'NA' ? { status, rejectReason: 'NA' } : { status, rejectReason: reason };
    await LeaveRequest.updateOne(filter, { $set: update });
    return res.send({ message: `Leave request status updated to ${status}` });
}

exports.getNoticeBoard = async (req, res, next) => {
    const notices = await Notice.find().sort({ createdAt: -1 }).lean();
    res.json(notices);
};

exports.createNotice = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { type, details, photo } = req.body;
    if (!type || !details) {
        return res.status(400).json({ message: 'Type and details are required.' });
    }

    const notice = await Notice.create({
        type,
        details,
        photo: photo || '',
        createdBy: req.session.user.userName || 'admin',
    });
    res.status(201).json(notice);
};

exports.updateNotice = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    const { type, details, photo } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Missing notice id' });
    }
    if (!type || !details) {
        return res.status(400).json({ message: 'Type and details are required.' });
    }

    const notice = await Notice.findByIdAndUpdate(
        id,
        { type, details, photo: photo || '' },
        { new: true }
    );

    if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(notice);
};

exports.deleteNotice = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Missing notice id' });
    }

    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
};

exports.getRulesRegulations = async (req, res, next) => {
    const { type } = req.query;
    const query = {};
    if (type && ['rule', 'regulation'].includes(type.toLowerCase())) {
        query.itemType = type.toLowerCase();
    }

    const items = await RuleRegulation.find(query).sort({ createdAt: -1 }).lean();
    res.json(items);
};

exports.createRuleRegulation = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { itemType, title, details } = req.body;
    if (!itemType || !title || !details) {
        return res.status(400).json({ message: 'Type, title, and details are required.' });
    }
    if (!['rule', 'regulation'].includes(itemType)) {
        return res.status(400).json({ message: 'Invalid item type.' });
    }

    const item = await RuleRegulation.create({
        itemType,
        title: title.trim(),
        details: details.trim(),
        createdBy: req.session.user.userName || 'admin',
    });

    res.status(201).json(item);
};

exports.updateRuleRegulation = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    const { itemType, title, details } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Missing item id' });
    }
    if (!itemType || !title || !details) {
        return res.status(400).json({ message: 'Type, title, and details are required.' });
    }
    if (!['rule', 'regulation'].includes(itemType)) {
        return res.status(400).json({ message: 'Invalid item type.' });
    }

    const item = await RuleRegulation.findByIdAndUpdate(
        id,
        {
            itemType,
            title: title.trim(),
            details: details.trim(),
        },
        { new: true }
    );

    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
};

exports.deleteRuleRegulation = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Missing item id' });
    }

    const item = await RuleRegulation.findByIdAndDelete(id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
};

exports.getAlertBoard = async (req, res, next) => {
    const alerts = await Alert.find().sort({ createdAt: -1 }).lean();
    res.json(alerts);
};

exports.createAlert = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { type, details, photo, targetStudentID, targetStudentName, targetRoomNo } = req.body;
    if (!type || !details) {
        return res.status(400).json({ message: 'Type and details are required.' });
    }

    const alert = await Alert.create({
        type,
        details,
        photo: photo || '',
        createdBy: req.session.user.userName || 'admin',
        targetStudentID: targetStudentID ? targetStudentID.trim() : '',
        targetStudentName: targetStudentName ? targetStudentName.trim() : '',
        targetRoomNo: targetRoomNo ? targetRoomNo.trim() : '',
    });

    res.status(201).json(alert);
};

exports.updateAlert = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    const { type, details, photo, targetStudentID, targetStudentName, targetRoomNo } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Missing alert id' });
    }
    if (!type || !details) {
        return res.status(400).json({ message: 'Type and details are required.' });
    }

    const alert = await Alert.findByIdAndUpdate(
        id,
        {
            type,
            details,
            photo: photo || '',
            targetStudentID: targetStudentID.trim(),
            targetStudentName: targetStudentName.trim(),
            targetRoomNo: targetRoomNo.trim(),
        },
        { new: true }
    );

    if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
};

exports.deleteAlert = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Missing alert id' });
    }

    const alert = await Alert.findByIdAndDelete(id);
    if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
};

exports.getLeaveHistoryStudents = async (req, res, next) => {
    const roomOrder = buildRoomOrder();
    const students = await Student.find().lean();
    const admittedStudents = students
        .map((student) => ({ ...student, roomNo: normalizeRoomNo(student.roomNo) }))
        .filter((student) => roomOrder.includes(student.roomNo));

    const studentByRoom = admittedStudents.reduce((acc, student) => {
        acc[student.roomNo] = acc[student.roomNo] || [];
        acc[student.roomNo].push(student);
        return acc;
    }, {});

    const sortedStudents = roomOrder.reduce((list, roomNo) => {
        const studentsInRoom = studentByRoom[roomNo] || [];
        studentsInRoom.sort((a, b) => a.studentID.localeCompare(b.studentID));
        list.push(...studentsInRoom);
        return list;
    }, []);

    res.json(sortedStudents.map(student => ({
        studentID: student.studentID,
        firstName: student.firstName,
        lastName: student.lastName,
        roomNo: student.roomNo,
        branch: student.branch,
        year: student.year,
    })));
};

exports.getLeaveHistoryForStudent = async (req, res, next) => {
    const { studentID } = req.query;
    if (!studentID) {
        return res.status(400).json({ message: 'Missing studentID' });
    }
    const history = await LeaveHistory.findOne({ studentID }).lean();
    if (!history) {
        return res.json({ studentID, leaveHistory: [] });
    }
    return res.json(history);
};

exports.getCurrentAdminProfile = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ userName: req.session.user.userName }).lean();
        if (!user) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        const admin = await Admin.findOne({ adminId: user.adminId }).lean();
        const profile = {
            userName: user.userName,
            email: user.email,
            userType: user.userType,
            adminId: user.adminId || '',
            firstName: admin?.firstName || '',
            lastName: admin?.lastName || '',
            profilePhoto: admin?.profilePhoto || '',
            theme: admin?.theme || 'light'
        };

        return res.json(profile);
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Admin Management Functions
exports.postAddAdmin = async (req, res, next) => {
    const { firstName, lastName, adminId, profilePhoto = '' } = req.body.data;

    if (!firstName || !lastName || !adminId) {
        return res.status(400).json({ message: 'First name, last name, and admin ID are required' });
    }

    try {
        // Check if adminId already exists
        const existingAdmin = await Admin.findOne({ adminId });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin ID already exists' });
        }

        // Create admin record
        const admin = new Admin({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            adminId: adminId.trim(),
            profilePhoto
        });

        await admin.save();
        return res.json({ message: 'Admin added successfully', admin });
    } catch (error) {
        console.error('Error adding admin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find().populate('userId', 'userName email userType adminId').sort({ createdAt: -1 });
        res.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAdminById = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    try {
        const admin = await Admin.findById(id).populate('userId', 'userName email userType adminId');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error fetching admin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateAdmin = async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, adminId, profilePhoto } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    if (!firstName || !lastName || !adminId) {
        return res.status(400).json({ message: 'First name, last name, and admin ID are required' });
    }

    try {
        // Check if adminId already exists for another admin
        const existingAdmin = await Admin.findOne({ adminId, _id: { $ne: id } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin ID already exists' });
        }

        const admin = await Admin.findByIdAndUpdate(
            id,
            {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                adminId: adminId.trim(),
                profilePhoto: profilePhoto || ''
            },
            { new: true }
        ).populate('userId', 'userName email userType adminId');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ message: 'Admin updated successfully', admin });
    } catch (error) {
        console.error('Error updating admin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteAdmin = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    try {
        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAnnouncements = async (req, res, next) => {
    try {
        const announcements = await require('../model/announcementSchema').find().sort({ createdAt: -1 }).lean();
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Error fetching announcements', error });
    }
};

exports.createAnnouncement = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, category, photo } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    try {
        const Announcement = require('../model/announcementSchema');
        const announcement = await Announcement.create({
            title: title.trim(),
            description: description.trim(),
            category: category || 'General',
            photo: photo || '',
            createdBy: req.session.user.userName || 'admin',
        });

        res.status(201).json(announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Error creating announcement', error });
    }
};

exports.updateAnnouncement = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    const { title, description, category, photo } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Missing announcement id' });
    }
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    try {
        const Announcement = require('../model/announcementSchema');
        const announcement = await Announcement.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                description: description.trim(),
                category: category || 'General',
                photo: photo || '',
            },
            { new: true }
        );

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json(announcement);
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ message: 'Error updating announcement', error });
    }
};

exports.deleteAnnouncement = async (req, res, next) => {
    if (!req.session || !req.session.user || req.session.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Missing announcement id' });
    }

    try {
        const Announcement = require('../model/announcementSchema');
        const announcement = await Announcement.findByIdAndDelete(id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Error deleting announcement', error });
    }
};

exports.updateAdminTheme = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.session.user.userType !== 'admin') {
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

        const admin = await Admin.findOne({ adminId: user.adminId });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.theme = theme;
        await admin.save();

        return res.status(200).json({ message: 'Theme updated successfully', theme });
    } catch (error) {
        console.error('Update theme error:', error);
        return res.status(500).json({ message: 'Error updating theme', error: error.message });
    }
};

exports.changeAdminPassword = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.session.user.userType !== 'admin') {
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
};

exports.getDashboardStats = async (req, res, next) => {
    try {
        // Active students: students with feeDue <= 0 or some logic
        const totalStudents = await Student.countDocuments();
        const activeStudents = await Student.countDocuments({ feeDue: { $lte: 0 } });

        // Pending complaints
        const pendingComplaints = await Complaint.countDocuments({ status: { $ne: 'completed' } });

        // Leave requests pending
        const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });

        // Mess attendance: average from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentAttendance = await Attendance.find({ recordedAt: { $gte: sevenDaysAgo } });
        const totalAttendanceRecords = recentAttendance.length;
        const presentCount = recentAttendance.filter(r => r.status === 'present').length;
        const averageAttendance = totalAttendanceRecords > 0 ? Math.round((presentCount / totalAttendanceRecords) * 100) : 0;

        res.json({
            activeStudents: activeStudents,
            pendingComplaints: pendingComplaints,
            pendingLeaves: pendingLeaves,
            averageAttendance: averageAttendance
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find().sort({ studentID: 1 });
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAttendanceHistory = async (req, res, next) => {
    try {
        const history = await AttendanceHistory.find().sort({ studentID: 1 });
        // Calculate last 7 days attendance trend
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().slice(0, 10);
            last7Days.push(dateStr);
        }

        const trend = last7Days.map(date => {
            const dayRecords = history.flatMap(h => h.attendanceHistory.filter(r => r.date === date));
            const present = dayRecords.filter(r => r.status === 'present').length;
            const total = dayRecords.length;
            return total > 0 ? Math.round((present / total) * 100) : 0;
        });

        res.json({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            series: trend
        });
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.changeAdminPassword = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.session.user.userType !== 'admin') {
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

        const bcrypt = require('bcryptjs');
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
};

exports.changeAdminPassword = async (req, res, next) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.session.user.userType !== 'admin') {
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

        const bcrypt = require('bcryptjs');
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

exports.createOrUpdateMessMenu = async (req, res, next) => {
    try {
        const { day, mealType, item } = req.body;
        
        if (!day || !mealType || !item || !item.name) {
            return res.status(400).json({ message: 'Day, mealType, and item name are required' });
        }

        let menu = await MessMenu.findOne();
        if (!menu) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            menu = await MessMenu.create({
                week: days.map(d => ({
                    day: d,
                    breakfast: [],
                    lunch: [],
                    snacks: [],
                    dinner: []
                }))
            });
        }

        const dayData = menu.week.find(w => w.day === day);
        if (!dayData) {
            return res.status(400).json({ message: 'Invalid day' });
        }

        if (!dayData[mealType]) {
            return res.status(400).json({ message: 'Invalid meal type' });
        }

        const newItem = {
            id: Date.now().toString(),
            name: item.name,
            type: item.type || 'Veg',
            description: item.description || ''
        };

        dayData[mealType].push(newItem);
        await menu.save();
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error creating/updating mess menu:', error);
        res.status(500).json({ message: 'Error creating/updating mess menu', error: error.message });
    }
};

exports.updateMessMenuItem = async (req, res, next) => {
    try {
        const { day, mealType, itemId } = req.params;
        const { name, type, description } = req.body;

        const menu = await MessMenu.findOne();
        if (!menu) {
            return res.status(404).json({ message: 'Mess menu not found' });
        }

        const dayData = menu.week.find(w => w.day === day);
        if (!dayData) {
            return res.status(400).json({ message: 'Invalid day' });
        }

        const item = dayData[mealType]?.find(i => i.id === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.name = name || item.name;
        item.type = type || item.type;
        item.description = description !== undefined ? description : item.description;

        await menu.save();
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error updating mess menu item:', error);
        res.status(500).json({ message: 'Error updating mess menu item', error: error.message });
    }
};

exports.deleteMessMenuItem = async (req, res, next) => {
    try {
        const { day, mealType, itemId } = req.params;

        const menu = await MessMenu.findOne();
        if (!menu) {
            return res.status(404).json({ message: 'Mess menu not found' });
        }

        const dayData = menu.week.find(w => w.day === day);
        if (!dayData) {
            return res.status(400).json({ message: 'Invalid day' });
        }

        const initialLength = dayData[mealType]?.length || 0;
        dayData[mealType] = dayData[mealType]?.filter(i => i.id !== itemId) || [];

        if (dayData[mealType].length === initialLength) {
            return res.status(404).json({ message: 'Item not found' });
        }

        await menu.save();
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error deleting mess menu item:', error);
        res.status(500).json({ message: 'Error deleting mess menu item', error: error.message });
    }
};
