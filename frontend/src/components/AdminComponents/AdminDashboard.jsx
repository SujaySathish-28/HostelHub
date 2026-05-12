import './AdminDashboard.css';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import StatsCard from './StatsCard';
import ChartSection from './ChartSection';
import ComplaintsTable from './ComplaintsTable';
import StudentsTable from './StudentsTable';
import LeaveRequestsTable from './LeaveRequestsTable';
import NoticeBoard from './NoticeBoard';
import MessMenuManager from './MessMenuManager';
import RulesManager from './RulesManager';
import AdminManagement from './AdminManagement';
import QuickActionsPanel from './QuickActionsPanel';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile } from '../../store/adminSlice';
import {
  getDashboardStats,
  getComplaints,
  getAllStudents,
  getLeaveRequests,
  getNoticeBoard,
  getRulesRegulations,
  getAllAdmins,
  getAttendanceHistory
} from '../../services/adminServices';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const adminProfile = useSelector((state) => state.admin.profile);
  const adminStatus = useSelector((state) => state.admin.status);
  const [stats, setStats] = useState({
    activeStudents: 0,
    pendingComplaints: 0,
    pendingLeaves: 0,
    averageAttendance: 0
  });
  const [chartData, setChartData] = useState({
    title: 'Admission & Attendance Trend',
    subtitle: 'Last 7 days overview',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [0, 0, 0, 0, 0, 0, 0]
  });
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notices, setNotices] = useState([]);
  const [rules, setRules] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminProfile && adminStatus === 'idle') {
      dispatch(fetchAdminProfile());
    }
  }, [dispatch, adminProfile, adminStatus]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes,
          complaintsRes,
          studentsRes,
          leaveRes,
          noticesRes,
          rulesRes,
          adminsRes,
          attendanceRes
        ] = await Promise.all([
          getDashboardStats(),
          getComplaints(),
          getAllStudents(),
          getLeaveRequests(),
          getNoticeBoard(),
          getRulesRegulations(),
          getAllAdmins(),
          getAttendanceHistory()
        ]);

        if (statsRes.activeStudents !== undefined) {
          setStats({
            activeStudents: statsRes.activeStudents,
            pendingComplaints: statsRes.pendingComplaints,
            pendingLeaves: statsRes.pendingLeaves,
            averageAttendance: statsRes.averageAttendance
          });
        }

        if (attendanceRes.labels && attendanceRes.series) {
          setChartData(prev => ({
            ...prev,
            series: attendanceRes.series
          }));
        }

        setComplaints(Array.isArray(complaintsRes) ? complaintsRes : []);
        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
        setLeaveRequests(Array.isArray(leaveRes) ? leaveRes : []);
        setNotices(Array.isArray(noticesRes) ? noticesRes : []);
        setRules(Array.isArray(rulesRes) ? rulesRes : []);
        setAdmins(Array.isArray(adminsRes) ? adminsRes : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformedStudents = students.map(student => ({
    id: student.studentID,
    name: `${student.firstName} ${student.lastName}`,
    year: student.year || student.branch || 'N/A',
    room: student.roomNo,
    status: student.feeDue > 0 ? 'Pending Dues' : 'Active'
  }));

  const transformedComplaints = complaints.map(complaint => ({
    id: complaint._id,
    student: complaint.studentID, // Could be enhanced with name lookup
    category: complaint.category,
    room: complaint.roomNo,
    status: complaint.status === 'completed' ? 'Resolved' : complaint.status === 'assigned' ? 'Assigned' : 'Open'
  }));

  const transformedLeaveRequests = leaveRequests.map(request => ({
    id: request._id,
    student: request.studentID, // Could be enhanced
    date: request.startDate ? new Date(request.startDate).toISOString().slice(0, 10) : 'N/A',
    duration: request.endDate && request.startDate ?
      `${Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)) + 1} days` :
      'N/A',
    status: request.status
  }));

  const transformedNotices = notices.map(notice => ({
    label: notice.category || 'General',
    message: notice.description
  }));

  const transformedRules = rules.map(rule => ({
    id: rule._id,
    title: rule.title,
    description: rule.description
  }));

  const transformedAdmins = admins.map(admin => ({
    id: admin.adminId,
    name: `${admin.firstName} ${admin.lastName}`,
    role: admin.role || 'Admin',
    lastLogin: admin.lastLogin || 'N/A'
  }));

  const statsCards = [
    { title: 'Active Students', value: stats.activeStudents.toString(), subtitle: 'Currently enrolled', icon: '🎓', accent: 'from-sky-500 to-blue-600' },
    { title: 'Pending Complaints', value: stats.pendingComplaints.toString(), subtitle: 'Need review', icon: '📩', accent: 'from-amber-500 to-orange-600' },
    { title: 'Leave Requests', value: stats.pendingLeaves.toString(), subtitle: 'Awaiting action', icon: '📝', accent: 'from-violet-500 to-fuchsia-600' },
    { title: 'Mess Attendance', value: `${stats.averageAttendance}%`, subtitle: 'Average weekly', icon: '🍽️', accent: 'from-emerald-500 to-teal-600' },
  ];

  const messMenu = [
    { day: 'Monday', breakfast: 'Poha, Tea', lunch: 'Rajma Chawal', dinner: 'Vegetable Biryani' },
    { day: 'Tuesday', breakfast: 'Idli, Sambar', lunch: 'Paneer Curry', dinner: 'Dal Makhani' },
    { day: 'Wednesday', breakfast: 'Upma, Juice', lunch: 'Chole Bhature', dinner: 'Mixed Veg' },
  ];

  const actions = [
    { title: 'Add Notice', description: 'Publish a new hostel announcement', icon: '📣' },
    { title: 'Approve Leave', description: 'Review pending leave requests', icon: '✅' },
    { title: 'Assign Mess Menu', description: 'Update weekly meal plan', icon: '🍲' },
    { title: 'Create Rule', description: 'Post a new hostel regulation', icon: '📜' },
  ];

  const navItems = [
    { title: 'Dashboard', icon: '🏠', path: '/admin' },
    { title: 'Complaints', icon: '📩', path: '/admin/admin-complaints' },
    { title: 'Leave Requests', icon: '📝', path: '/admin/pending-leave-requests' },
    { title: 'Mess Menu', icon: '🍽️', path: '/admin/mess-menu' },
    { title: 'Notice Board', icon: '📢', path: '/admin/notice-board' },
    { title: 'Rules', icon: '📚', path: '/admin/rules-regulations' },
    { title: 'Admin Users', icon: '👥', path: '/admin/add-admin' },
    { title: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          <div className="dashboard-main-grid">
            <aside className="dashboard-sidebar">
              <AdminSidebar navItems={navItems} selectedKey="Dashboard" adminProfile={adminProfile} />
            </aside>
            <main className="dashboard-main">
              <AdminNavbar profileName="Priya Sharma" role="Head Admin" alertsCount={4} adminProfile={adminProfile} />
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-300">Loading dashboard data...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="dashboard-main-grid">
          <aside className="dashboard-sidebar">
            <AdminSidebar navItems={navItems} selectedKey="Dashboard" adminProfile={adminProfile} />
          </aside>

          <main className="dashboard-main">
              <AdminNavbar profileName="Priya Sharma" role="Head Admin" alertsCount={4} adminProfile={adminProfile} />
            <section className="dashboard-top-section">
              <div className="stats-cards-grid">
                {statsCards.map((stat) => (
                  <StatsCard key={stat.title} title={stat.title} value={stat.value} subtitle={stat.subtitle} icon={stat.icon} accent={stat.accent} />
                ))}
              </div>
            </section>

            <section className="dashboard-middle-section">
              <ChartSection data={chartData} />

              <div className="space-y-6">
                <NoticeBoard notices={transformedNotices} />
                <MessMenuManager menu={messMenu} />
              </div>
            </section>

            <section className="dashboard-bottom-section">
              <div className="grid gap-6 xl:grid-cols-2">
                <ComplaintsTable complaints={transformedComplaints} />
                <LeaveRequestsTable requests={transformedLeaveRequests} />
              </div>

              <div className="space-y-6">
                <StudentsTable students={transformedStudents} />
                <RulesManager rules={transformedRules} />
                <AdminManagement admins={transformedAdmins} />
                <QuickActionsPanel actions={actions} />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
