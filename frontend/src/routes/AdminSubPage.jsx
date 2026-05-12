import { useParams } from 'react-router-dom';
import AdmitStudent from '../components/AdminComponents/AdmitStudent';
import AdminLeaveRequests from '../components/AdminComponents/AdminLeaveRequests';
import AdminAcceptedLeaveRequests from '../components/AdminComponents/AdminAcceptedLeaveRequests';
import AdminRejectedLeaveRequests from '../components/AdminComponents/AdminRejectedLeaveRequests';
import AdminLeaveHistory from '../components/AdminComponents/AdminLeaveHistory';
import AdminComplaints from '../components/AdminComponents/AdminComplaints';
import AdminNoticeBoard from '../components/AdminComponents/AdminNoticeBoard';
import AdminAnnouncements from '../components/AdminComponents/AdminAnnouncements';
import AdminAlerts from '../components/AdminComponents/AdminAlerts';
import RulesRegulations from '../components/AdminComponents/RulesRegulations';
import AddAdmin from '../components/AdminComponents/AddAdmin';
import AdminProfile from '../components/AdminComponents/AdminProfile';
import AdminMessMenu from '../components/AdminComponents/AdminMessMenu';
import AdminSettings from '../components/AdminComponents/AdminSettings';
import ProtectedRouteForAdmin from '../components/ProtectedRouteForAdmin';

const pageTitles = {
  'admit-student': 'Admit a Student',
  'report-student': 'Report a Student',
  'remarks-of-student': 'Remarks of Student',
  'admin-complaints': 'Student Complaints',
  'leave-requests': 'Leave Requests',
  'accepted-leave-requests': 'Accepted Leave Requests',
  'rejected-leave-requests': 'Rejected Leave Requests',
  'leave-history': 'Leave History',
  'notice-board': 'Notice Board',
  'rules-regulations': 'Rules & Regulations',
  'alerts': 'Alerts',
  'announcements': 'Announcements',
  'add-admin': 'Add Admin',
  'mess-menu': 'Mess Menu',
  'profile': 'Admin Profile',
  'settings': 'Settings'
};

const AdminSubPage = () => {
  const { page } = useParams();
  const title = pageTitles[page] || 'Admin Page';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.pageHeader}>
          <div style={styles.titleBlock}>
            <div style={styles.titleBadge}>🛠️</div>
            <div>
              <h1 style={styles.pageTitle}>{title}</h1>
              <p style={styles.description}>Use this section to manage hostel operations, student records, notices, leave requests and alerts.</p>
            </div>
          </div>
        </div>
        {page==='admit-student' && <AdmitStudent/>}
        {page==='report-student' }
        {page==='remarks-of-student'  }
        {page==='pending-leave-requests' && <AdminLeaveRequests/> }
        {page==='accepted-leave-requests' && <AdminAcceptedLeaveRequests/> }
        {page==='rejected-leave-requests' && <AdminRejectedLeaveRequests/> }
        {page==='leave-history' && <AdminLeaveHistory/> }
        {page==='notice-board' && <ProtectedRouteForAdmin><AdminNoticeBoard/></ProtectedRouteForAdmin> }
        {page==='rules-regulations' && <ProtectedRouteForAdmin><RulesRegulations/></ProtectedRouteForAdmin> }
        {page==='alerts' && <ProtectedRouteForAdmin><AdminAlerts/></ProtectedRouteForAdmin> }
        {page==='announcements' && <ProtectedRouteForAdmin><AdminAnnouncements/></ProtectedRouteForAdmin> }
        {page==='mess-menu' && <ProtectedRouteForAdmin><AdminMessMenu/></ProtectedRouteForAdmin> }
        {page==='admin-complaints' && <AdminComplaints/> }
        {page==='add-admin' && <ProtectedRouteForAdmin><AddAdmin/></ProtectedRouteForAdmin> }
        {page==='profile' && <AdminProfile />}
        {page==='settings' && <AdminSettings />}
        {page==='feedback' && (
            <div style={styles.profileContent}>
                <h2 style={styles.title}>Admin Feedback</h2>
                <p style={styles.description}>Use this section to review or submit feedback as an admin.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 140px)',
    backgroundColor: 'var(--bg)'
  },
  card: {
    width: '100%',
    maxWidth: '83%',
    backgroundColor: 'var(--card-bg)',
    padding: '10px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    color: 'var(--text)'
  },
  title: {
    margin: 0,
    color: 'var(--text-h)',
    fontSize: '32px'
  },
  description: {
    marginTop: '16px',
    color: 'var(--muted)',
    fontSize: '17px',
    lineHeight: '1.65'
  },
  pageHeader: {
    marginBottom: '26px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border)',
  },
  titleBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '18px',
  },
  titleBadge: {
    minWidth: '52px',
    minHeight: '52px',
    borderRadius: '18px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.35rem',
  },
  pageTitle: {
    margin: 0,
    color: 'var(--text-h)',
    fontSize: '2.25rem',
    fontWeight: 800,
  },
  profileContent: {
    padding: '24px',
    borderRadius: '16px',
    backgroundColor: 'var(--panel-bg)',
    border: '1px solid var(--border)',
  }
};

export default AdminSubPage;
