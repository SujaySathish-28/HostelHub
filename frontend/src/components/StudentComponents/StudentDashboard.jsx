import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentProfile } from '../../store/studentSlice';
import { getStudentAttendanceStats, getStudentComplaints, getLeaveRequestStatus, getStudentLeaveHistory, getAnnouncements, getStudentAlerts } from '../../services/studentServices';
import StudentFee from './StudentFee';
import './StudentDashboard.css';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/student' },
  { key: 'profile', label: 'Profile', icon: UserIcon, path: '/student/profile' },
  { key: 'fees', label: 'Fees', icon: CashIcon, path: '/student/fees' },
  { key: 'complaints', label: 'Complaints', icon: ChatBubbleIcon, path: '/student/complaint' },
  { key: 'leave', label: 'Leave Request', icon: CalendarIcon, path: '/student/leave' },
  { key: 'attendance', label: 'Attendance', icon: ChartPieIcon, path: '/student/attendance' },
  { key: 'settings', label: 'Settings', icon: CogIcon, path: '/student/settings' },
];

const defaultAnnouncements = [
  { title: 'Study hall', detail: 'All the students are allowed to use the study at any time(only for the purpose of Studying).' },
];

const messMenuFallback = {
  breakfast: ['Masala Dosa', 'Coconut Chutney', 'Fresh Juice'],
  lunch: ['Paneer Butter Masala', 'Jeera Rice', 'Salad'],
  dinner: ['Vegetable Biryani', 'Raita', 'Fruit Salad'],
};

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.student.profile);
  const status = useSelector((state) => state.student.status);
  const activeNav = location.pathname === '/student' ? 'dashboard' : location.pathname.split('/')[2] || 'dashboard';
  const [attendanceStats, setAttendanceStats] = useState({ totalDays: 0, presentDays: 0, absentDays: 0, attendancePercentage: 0, admittedDate: null });
  const [complaints, setComplaints] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!profile?.studentID) return;

    try {
      const [attendanceRes, complaintsRes, leaveRes, historyRes, announcementsRes, alertsRes] = await Promise.all([
        getStudentAttendanceStats(),
        getStudentComplaints(),
        getLeaveRequestStatus(profile.studentID),
        getStudentLeaveHistory(),
        getAnnouncements(),
        getStudentAlerts()
      ]);

      setAttendanceStats(attendanceRes);
      setComplaints(complaintsRes);
      setLeaveRequests(Array.isArray(leaveRes) ? leaveRes : []);
      setLeaveHistory(historyRes.leaveHistory || []);
      setAnnouncements(Array.isArray(announcementsRes) ? announcementsRes.slice(0, 3) : 'No recent Announcements!');
      setAlerts(Array.isArray(alertsRes) ? alertsRes.slice(0, 3) : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile && status === 'idle') {
      dispatch(fetchStudentProfile());
    }
  }, [dispatch, profile, status]);

  useEffect(() => {
    if (profile?.studentID) {
      fetchDashboardData();
    }
  }, [profile?.studentID]);

  useEffect(() => {
    const stored = window.localStorage.getItem('adminMessMenuItems');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Object.keys(parsed).length) {
          setMessMenuData(parsed);
        }
      } catch (error) {
        console.warn('Could not parse mess menu from localStorage', error);
      }
    }
  }, []);

  const displayedProfile = profile || {};
  const studentName = `${displayedProfile.firstName || ''} ${displayedProfile.lastName || ''}`.trim() || 'Student';
  const roomLabel = displayedProfile.roomNo ? `Room ${displayedProfile.roomNo}` : 'Room not assigned';
  const branchLabel = displayedProfile.branch || 'Hostel student';
  const yearLabel = displayedProfile.year ? `${displayedProfile.year}${displayedProfile.year === '1' ? 'st' : displayedProfile.year === '2' ? 'nd' : displayedProfile.year === '3' ? 'rd' : 'th'}` : 'Year not set';
  const profileInitials = displayedProfile.firstName && displayedProfile.lastName ? `${displayedProfile.firstName[0]}${displayedProfile.lastName[0]}`.toUpperCase() : displayedProfile.studentID?.slice(0, 2).toUpperCase() || 'ST';
  const profileImage = displayedProfile.profilePhoto || 'https://via.placeholder.com/80?text=ST';
  const totalFee = Number(displayedProfile.totalFee || 0);
  const feePaid = Number(displayedProfile.feePaid || 0);
  const feeDue = Number(displayedProfile.feeDue ?? Math.max(totalFee - feePaid, 0));
  const feeDueLabel = feeDue > 0 ? `₹${feeDue.toLocaleString()}` : 'No Due';
  const feeDescription = feeDue > 0 ? `${feeDue > 0 ? 'Outstanding amount' : 'All fees cleared'}` : 'All fees cleared';

  // Calculate dynamic stats
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const openComplaints = complaints.filter(comp => comp.status !== 'resolved').length;
  const recentAlerts = alerts.slice(0, 3);
  const admittedDateDisplay = attendanceStats.admittedDate ? new Date(attendanceStats.admittedDate).toLocaleDateString('en-IN') : 'Not available';

  const activityLog = [
    ...complaints.map(comp => ({
      icon: ChatBubbleIcon,
      title: 'Complaint filed',
      description: `${comp.category || 'General'} complaint: ${comp.complaint?.substring(0, 50) || 'Issue reported'}`,
      time: comp.createdAt ? new Date(comp.createdAt).toLocaleString('en-IN') : 'Recent',
      timestamp: comp.createdAt ? new Date(comp.createdAt).getTime() : 0,
      badge: comp.status === 'resolved' ? 'Resolved' : 'Pending',
      badgeClass: comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
    })),
    ...alerts.map(alert => ({
      icon: ExclamationCircleIcon,
      title: 'Hostel Alert',
      description: alert.message || alert.detail || alert.type || 'Important notice',
      time: alert.createdAt ? new Date(alert.createdAt).toLocaleString('en-IN') : 'Recent',
      timestamp: alert.createdAt ? new Date(alert.createdAt).getTime() : 0,
      badge: 'Alert',
      badgeClass: 'bg-blue-100 text-blue-700'
    })),
    ...announcements.map(ann => ({
      icon: AnnouncementIcon,
      title: 'New Announcement',
      description: `${ann.title}: ${ann.description?.substring(0, 50) || 'Important update'}`,
      time: ann.createdAt ? new Date(ann.createdAt).toLocaleString('en-IN') : 'Recent',
      timestamp: ann.createdAt ? new Date(ann.createdAt).getTime() : 0,
      badge: ann.category || 'Notice',
      badgeClass: 'bg-indigo-100 text-indigo-700'
    }))
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3)
    .map(({ timestamp, ...item }) => item);

  const leaveHistoryData = leaveHistory.slice(0, 2).map(record => ({
    icon: CalendarIcon,
    title: `Leave from ${record.outDate || 'N/A'} to ${record.inDate || 'N/A'}`,
    status: 'Completed',
    statusClass: 'bg-emerald-100 text-emerald-700',
    date: record.outDate || 'N/A'
  }));

  const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').slice(0, 2).map(req => ({
    icon: CalendarIcon,
    title: `Leave request (${req.dateOfLeave} to ${req.returnDate})`,
    status: 'Pending',
    statusClass: 'bg-amber-100 text-amber-700',
    date: req.dateOfLeave
  }));

  const displayLeaveHistory = [...leaveHistoryData, ...pendingLeaves].slice(0, 2);

  const statsCards = [
    {
      title: 'Room Details',
      value: roomLabel,
      description: `${branchLabel} · ${yearLabel}`,
      icon: BuildingIcon,
      color: 'bg-sky-100 text-sky-700',
    },
    {
      title: 'Fee Status',
      value: feeDue > 0 ? `₹${feeDue.toLocaleString()}` : 'Paid in full',
      description: feeDue > 0 ? `₹${totalFee.toLocaleString()} total, ₹${feePaid.toLocaleString()} paid` : 'All fees cleared',
      icon: WalletIcon,
      color: feeDue > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Attendance',
      value: `${attendanceStats.attendancePercentage}%`,
      description: `${attendanceStats.presentDays} present out of ${attendanceStats.totalDays} days`,
      icon: ShieldCheckIcon,
      color: attendanceStats.attendancePercentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Complaints',
      value: `${openComplaints} Open`,
      description: openComplaints > 0 ? `${openComplaints} pending resolution` : 'All complaints resolved',
      icon: ExclamationCircleIcon,
      color: openComplaints > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Leave Requests',
      value: `${pendingLeaveRequests} Pending`,
      description: pendingLeaveRequests > 0 ? 'Waiting approval' : 'No pending requests',
      icon: DocumentTextIcon,
      color: pendingLeaveRequests > 0 ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Mess Menu',
      value: 'Available',
      description: 'Check today\'s menu',
      icon: SparklesIcon,
      color: 'bg-indigo-100 text-indigo-700',
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="dashboard-main-grid">
          <aside className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-logo">HB</div>
              <div className="sidebar-title">
                <p className="sidebar-label">HostelHub</p>
                <h2 className="sidebar-name">Student Panel</h2>
              </div>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`nav-button ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="sidebar-help">
              <p className="help-label">Need help?</p>
              <h3 className="help-title">Contact your warden</h3>
              <p className="help-description">Reach out for any facility or room support through the student helpdesk.</p>
            </div>
          </aside>

          <main className="dashboard-main">
            <header className="dashboard-header">
              <div className="header-welcome">
                <p className="welcome-label">Welcome back,</p>
                <h1 className="welcome-name">{studentName}</h1>
                <p className="welcome-description">Explore your hostel details, requests, announcements and meal plans.</p>
              </div>
              <div className="header-actions">
                <button className="notification-btn">
                  <BellIcon className="h-6 w-6" />
                </button>
                <div className="profile-info">
                  <img
                    src={profileImage}
                    alt="Student profile"
                    className="profile-avatar"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80?text=ST'; }}
                  />
                  <div className="profile-text">
                    <p className="profile-role">Student</p>
                    <p className="profile-name">{studentName}</p>
                  </div>
                </div>
                <button className="logout-btn">
                  <LogoutIcon className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </header>

            <section className="dashboard-top-section">
              <article className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-card-info">
                    <div className="profile-initials">{profileInitials}</div>
                    <div className="profile-details">
                      <p className="profile-type">{branchLabel}</p>
                      <h2 className="profile-full-name">{studentName}</h2>
                      <p className="profile-room">{roomLabel} · {branchLabel}</p>
                    </div>
                  </div>

                  <div className="profile-stats-grid">
                    <div className="profile-stat-box">
                      <p className="stat-label">Student ID</p>
                      <p className="stat-value">{displayedProfile.studentID || 'N/A'}</p>
                    </div>
                    <div className="profile-stat-box">
                      <p className="stat-label">Year</p>
                      <p className="stat-value">{yearLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-bottom-stats">
                  <div className="stat-item">
                    <p className="stat-item-label">Fee due</p>
                    <p className="stat-item-value">{feeDueLabel}</p>
                    <p className="stat-item-description">{feeDescription}</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-item-label">Attendance</p>
                    <p className="stat-item-value">{attendanceStats.attendancePercentage}%</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${attendanceStats.attendancePercentage}%` }} />
                    </div>
                  </div>
                  <div className="stat-item">
                    <p className="stat-item-label">Complaints</p>
                    <p className="stat-item-value">{openComplaints} Open</p>
                    <p className="stat-item-description">{openComplaints > 0 ? `${openComplaints} pending resolution` : 'All resolved'}</p>
                  </div>
                </div>
              </article>

              <div>
                <StudentFee />
              </div>

              <div className="stats-cards-grid">
                {statsCards.map((card) => {
                  const Icon = card.icon;
                  const colorClass = card.color.split(' ')[0].replace('bg-', 'icon-');
                  return (
                    <article key={card.title} className="stat-card">
                      <div className="stat-card-header">
                        <div className="stat-card-content">
                          <p className="stat-card-title">{card.title}</p>
                          <p className="stat-card-value">{card.value}</p>
                        </div>
                        <span className={`stat-card-icon ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <p className="stat-card-description">{card.description}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="dashboard-middle-section">
              <article className="dashboard-article">
                <div className="article-header">
                  <div className="article-title-section">
                    <h2 className="article-title">Announcements</h2>
                    <p className="article-subtitle">Latest hostel updates and important notices.</p>
                  </div>
                  <span className="article-badge">{announcements.length} new</span>
                </div>
                <div className="announcements-list">
                  {announcements.length > 0 ? announcements.map((item, index) => (
                    <div key={index} className="announcement-item">
                      <div className="announcement-content">
                        <span className="announcement-icon">
                          <AnnouncementIcon className="h-5 w-5" />
                        </span>
                        <div className="announcement-text">
                          <div className="announcement-header">
                            <h3 className="announcement-title">{item.title || 'Hostel Announcement'}</h3>
                            <span className="announcement-time">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                          </div>
                          <p className="announcement-detail">{item.description || item.content || 'Important hostel update'}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="announcement-item">
                      <div className="announcement-content">
                        <span className="announcement-icon">
                          <AnnouncementIcon className="h-5 w-5" />
                        </span>
                        <div className="announcement-text">
                          <div className="announcement-header">
                            <h3 className="announcement-title">No announcements</h3>
                            <span className="announcement-time">Now</span>
                          </div>
                          <p className="announcement-detail">Stay tuned for important updates</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </section>

            <section className="dashboard-bottom-section">
              <article className="dashboard-article">
                <div className="article-header">
                  <div className="article-title-section">
                    <h2 className="article-title">Recent Activity</h2>
                    <p className="article-subtitle">Track recent complaints, payments and attendance logs.</p>
                  </div>
                </div>
                <div className="activity-list">
                  {activityLog.map((item) => (
                    <div key={item.title} className="activity-item">
                      <div className="activity-content">
                        <div className="activity-left">
                          <span className="activity-icon">
                            <item.icon className="h-5 w-5" />
                          </span>
                          <div className="activity-text">
                            <h3 className="activity-title">{item.title}</h3>
                            <p className="activity-description">{item.description}</p>
                          </div>
                        </div>
                        <span className={`activity-badge ${item.badge === 'Pending' ? 'badge-pending' : item.badge === 'Due' ? 'badge-due' : 'badge-confirmed'}`}>{item.badge}</span>
                      </div>
                      <p className="activity-time">{item.time}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="dashboard-article">
                <div className="article-header">
                  <div className="article-title-section">
                    <h2 className="article-title">Leave History</h2>
                    <p className="article-subtitle">Approved and pending leave requests at a glance.</p>
                  </div>
                  <span className="article-badge">Latest</span>
                </div>
                <div className="leave-list">
                  {displayLeaveHistory.length > 0 ? displayLeaveHistory.map((item, index) => (
                    <div key={index} className="leave-item">
                      <div className="leave-item-content">
                        <div className="leave-left">
                          <span className="leave-icon">
                            <item.icon className="h-5 w-5" />
                          </span>
                          <div className="leave-text">
                            <h3 className="leave-title">{item.title}</h3>
                            <p className="leave-date">{item.date}</p>
                          </div>
                        </div>
                        <span className={`leave-status ${item.status === 'Completed' ? 'status-approved' : 'status-pending'}`}>{item.status}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="leave-item">
                      <div className="leave-item-content">
                        <div className="leave-left">
                          <span className="leave-icon">
                            <CalendarIcon className="h-5 w-5" />
                          </span>
                          <div className="leave-text">
                            <h3 className="leave-title">No leave history</h3>
                            <p className="leave-date">No records found</p>
                          </div>
                        </div>
                        <span className="leave-status status-approved">None</span>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

function DashboardIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h7v9H3zM14 3h7v18h-7zM14 12h7v6h-7zM3 3h7v6H3z" />
    </svg>
  );
}
function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function CashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
      <path d="M7 10h10M7 14h7" />
    </svg>
  );
}
function ChatBubbleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function CalendarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function ChartPieIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2.05a9 9 0 1 0 9 9H11V2.05z" />
      <path d="M21.95 11H11V2.05" />
    </svg>
  );
}
function CogIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.94 1.94 0 0 0 .33 2l.06.06a2 2 0 1 1-2.82 2.82l-.06-.06a1.94 1.94 0 0 0-2-.33 1.94 1.94 0 0 0-1.46 1.83V21a2 2 0 1 1-4 0v-.09A1.94 1.94 0 0 0 8.6 19a1.94 1.94 0 0 0-2 .33l-.06.06a2 2 0 1 1-2.82-2.82l.06-.06A1.94 1.94 0 0 0 3 15a1.94 1.94 0 0 0-1.83-1.46H1a2 2 0 1 1 0-4h.09A1.94 1.94 0 0 0 3 8.6a1.94 1.94 0 0 0-.33-2l-.06-.06A2 2 0 1 1 5.43 3.7l.06.06A1.94 1.94 0 0 0 7.9 3a1.94 1.94 0 0 0 1.46-1.83V1a2 2 0 1 1 4 0v.09A1.94 1.94 0 0 0 14.4 3a1.94 1.94 0 0 0 2-.33l.06-.06A2 2 0 1 1 19.8 5.43l-.06.06A1.94 1.94 0 0 0 20 7.9a1.94 1.94 0 0 0 1.83 1.46H23a2 2 0 1 1 0 4h-.09A1.94 1.94 0 0 0 20 15z" />
    </svg>
  );
}
function BuildingIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
      <path d="M8 22V12h8v10" />
      <path d="M8 6h8" />
      <path d="M10 10h.01M14 10h.01M10 14h.01M14 14h.01" />
    </svg>
  );
}
function WalletIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M16 6v4" />
      <path d="M8 10h4" />
    </svg>
  );
}
function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function ExclamationCircleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
function DocumentTextIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6M9 16h6M9 8h3" />
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    </svg>
  );
}
function SparklesIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="m5 20 1.5-4.5L11 14l-4.5-1.5L5 8l-1.5 4.5L0 14l4.5 1.5L5 20z" />
    </svg>
  );
}
function AnnouncementIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h3l2-2h6l2 2h3a1 1 0 0 1 1 1v4c0 4.42-3.58 8-8 8s-8-3.58-8-8V6a1 1 0 0 1 1-1z" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
    </svg>
  );
}
function BellIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function LogoutIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export default StudentDashboard;



// const [messMenuData, setMessMenuData] = useState(messMenuFallback); 

// div className="mess-menu-section">
//                   {Object.entries(messMenuData).map(([meal, items]) => (
//                     <div key={meal} className="meal-item">
//                       <div className="meal-header">
//                         <p className="meal-name">{meal}</p>
//                         <span className="meal-badge">Fresh</span>
//                       </div>
//                       <div className="meal-items">
//                         {items.map((menuItem, index) => {
//                           const menuLabel = typeof menuItem === 'string'
//                             ? menuItem
//                             : menuItem?.name || menuItem?.description || 'Menu item';
//                           const menuKey = typeof menuItem === 'string'
//                             ? `${meal}-${menuItem}-${index}`
//                             : `${menuItem.id || menuLabel}-${index}`;
//                           return (
//                             <span key={menuKey} className="meal-item-tag">{menuLabel}</span>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>