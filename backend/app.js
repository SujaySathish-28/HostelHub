const http=require('http');
const mongoose=require('mongoose')
const express=require('express');
const cors=require('cors')
const dotenv = require('dotenv');
dotenv.config();

const hostelRouter=require('./routes/hostelRouter');
const Mongo_URL='mongodb+srv://sujaysathish0028_db_user:C8553ICdwENAI97U@cluster0.eyqcpax.mongodb.net/hostel?appName=Cluster0';
const app=express();

const session=require('express-session');
const adminRouter = require('./routes/adminRouter');
const studentRouter = require('./routes/studentRouter');
const Attendance = require('./model/attendanceSchema');
const MongoDBStore=require('connect-mongodb-session')(session);
const store=new MongoDBStore({
    uri:Mongo_URL,
    collection:'sessions',
})

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(session({
    secret:'developing new project',
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie: {
        secure: false, // true only in HTTPS
        httpOnly: true
    }
}))
const isAuthenticated = (req, res, next) => {
    const publicRoutes = ['/', '/sign-in', '/sign-up', '/student/forgot-password', '/student/reset-password', '/student/verify-reset-token'];
    if (publicRoutes.includes(req.path)) {
        return next(); // allow public routes
    }
    console.log('session-user',req.session.user)
    if (req.session && req.session.user) {
        return next();
    }

    return res.status(401).json({ message: "Unauthorized" });
};

app.use(isAuthenticated);
app.use(hostelRouter);
app.use(adminRouter);
app.use(studentRouter);

const PORT=3001;
mongoose.connect(Mongo_URL).then(async () => {
    console.log('connected to mongodb');
    try {
        const indexes = await Attendance.collection.indexes();
        const oldAttendanceIndex = indexes.find((index) => index.name === 'studentID_1');
        if (oldAttendanceIndex) {
            await Attendance.collection.dropIndex('studentID_1');
            console.log('Dropped old studentID-only attendance index');
        }
        await Attendance.syncIndexes();
        console.log('Attendance indexes synchronized');
    } catch (err) {
        console.error('Error syncing attendance indexes:', err.message || err);
    }
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
});

