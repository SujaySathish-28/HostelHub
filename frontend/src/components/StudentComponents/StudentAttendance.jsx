import { useEffect, useState } from 'react';
import { getStudentAttendanceStats } from '../../services/studentServices';

const StudentAttendance = () => {
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0,
    admittedDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStudentAttendanceStats();
        setAttendanceStats(data);
      } catch (err) {
        setError('Could not load attendance stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: '#334155' }}>Loading attendance details…</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '12px', color: '#111827' }}>Attendance</h2>
      <p style={{ marginBottom: '24px', color: '#475569', lineHeight: 1.7 }}>
        Review your attendance performance and admitted date below.
      </p>
      {error ? (
        <div style={{ color: '#b91c1c', background: '#fbe4e6', padding: '18px', borderRadius: '14px' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div style={{ borderRadius: '18px', padding: '22px', background: '#ffffff', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Attendance %</p>
            <p style={{ marginTop: '10px', fontSize: '2rem', color: '#0f172a' }}>{attendanceStats.attendancePercentage}%</p>
          </div>
          <div style={{ borderRadius: '18px', padding: '22px', background: '#ffffff', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Present Days</p>
            <p style={{ marginTop: '10px', fontSize: '1.75rem', color: '#0f172a' }}>{attendanceStats.presentDays}</p>
          </div>
          <div style={{ borderRadius: '18px', padding: '22px', background: '#ffffff', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Absent Days</p>
            <p style={{ marginTop: '10px', fontSize: '1.75rem', color: '#0f172a' }}>{attendanceStats.absentDays}</p>
          </div>
          <div style={{ borderRadius: '18px', padding: '22px', background: '#eef2ff', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)' }}>
            <p style={{ margin: 0, color: '#4338ca' }}>Admitted Date</p>
            <p style={{ marginTop: '10px', fontSize: '1.15rem', color: '#1e3a8a' }}>{attendanceStats.admittedDate ? new Date(attendanceStats.admittedDate).toLocaleDateString('en-IN') : 'Not available'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
