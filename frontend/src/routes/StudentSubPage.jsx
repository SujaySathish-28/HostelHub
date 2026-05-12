import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentProfile } from '../store/studentSlice';
import LeaveRequest from '../components/StudentComponents/LeaveRequest.jsx';
import LeaveRequestStatus from '../components/StudentComponents/LeaveRequestStatus.jsx';
import StudentLeaveHistory from '../components/StudentComponents/StudentLeaveHistory.jsx';
import NoticeBoard from '../components/StudentComponents/NoticeBoard.jsx';
import StudentAlerts from '../components/StudentComponents/StudentAlerts.jsx';
import RulesAndRegulations from '../components/StudentComponents/RulesAndRegulations.jsx';
import Complaint from '../components/StudentComponents/Complaint.jsx';
import StudentMessMenu from '../components/StudentComponents/StudentMessMenu.jsx';
import StudentFeeDetails from '../components/StudentComponents/StudentFeeDetails.jsx';
import StudentAttendance from '../components/StudentComponents/StudentAttendance.jsx';
import StudentSettings from '../components/StudentComponents/StudentSettings.jsx';
import ProtectedRouteForStudent from '../components/ProtectedRouteForStudent.jsx';

const pageTitles = {
  'leave': 'Submit Leave Request',
  'leave-status': 'Leave Request Status',
  'leave-history': 'Leave History',
  'complaint': 'Submit Complaint',
  'notices': 'Notice Board',
  'rules-regulations': 'Rules & Regulations',
  'alerts': 'Alerts',
  'mess-menu': 'Mess Menu',
  'fees': 'Fee Details',
  'attendance': 'Attendance',
  'settings': 'Settings'
};

const StudentSubPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.student.profile);
  const status = useSelector((state) => state.student.status);
  const { page: paramPage } = useParams();
  const location = useLocation();
  const page = paramPage || location.pathname.replace(/^\/student\//, '');
  const title = pageTitles[page] || 'Student Page';

  useEffect(() => {
    if (!profile && status === 'idle') {
      dispatch(fetchStudentProfile());
    }
  }, [dispatch, profile, status]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.description}>
            {page === 'leave' && 'Submit your leave request and keep the administration informed.'}
            {page === 'leave-status' && 'Track the status of your leave requests in one place.'}
            {page === 'leave-history' && 'Review your past leave history and details.'}
            {page === 'complaint' && 'Submit a complaint and share any concerns with the hostel team.'}
            {page === 'notices' && 'View all notices published for students.'}
            {page === 'rules-regulations' && 'Read the hostel rules and regulations that apply to all students.'}
            {page === 'alerts' && 'View active alerts from the administration.'}
            {!pageTitles[page] && 'Select an available student module from the dashboard.'}
          </p>
        </div>

        {page === 'leave' && <ProtectedRouteForStudent><LeaveRequest /></ProtectedRouteForStudent>}
        {page === 'leave-status' && <ProtectedRouteForStudent><LeaveRequestStatus /></ProtectedRouteForStudent>}
        {page === 'leave-history' && <ProtectedRouteForStudent><StudentLeaveHistory /></ProtectedRouteForStudent>}
        {page === 'complaint' && <ProtectedRouteForStudent><Complaint /></ProtectedRouteForStudent>}
        {page === 'notices' && <ProtectedRouteForStudent><NoticeBoard /></ProtectedRouteForStudent>}
        {page === 'rules-regulations' && <ProtectedRouteForStudent><RulesAndRegulations /></ProtectedRouteForStudent>}
        {page === 'alerts' && <ProtectedRouteForStudent><StudentAlerts /></ProtectedRouteForStudent>}
        {page === 'mess-menu' && <ProtectedRouteForStudent><StudentMessMenu /></ProtectedRouteForStudent>}
        {page === 'fees' && <ProtectedRouteForStudent><StudentFeeDetails /></ProtectedRouteForStudent>}
        {page === 'attendance' && <ProtectedRouteForStudent><StudentAttendance /></ProtectedRouteForStudent>}
        {page === 'settings' && <ProtectedRouteForStudent><StudentSettings /></ProtectedRouteForStudent>}
        {!pageTitles[page] && (
          <div style={styles.notFound}>
            Selected student section not found. Please choose a valid option from the dashboard.
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
    maxWidth: '85%',
    backgroundColor: 'var(--card-bg)',
    padding: '22px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow)',
    color: 'var(--text)'
  },
  header: {
    marginBottom: '18px'
  },
  title: {
    margin: 0,
    color: 'var(--text-h)',
    fontSize: '30px'
  },
  description: {
    marginTop: '14px',
    color: 'var(--muted)',
    fontSize: '16px',
    lineHeight: 1.7
  },
  notFound: {
    padding: '24px',
    borderRadius: '16px',
    backgroundColor: 'var(--panel-bg)',
    border: '1px solid var(--border)',
    color: 'var(--muted)'
  }
};

export default StudentSubPage;
