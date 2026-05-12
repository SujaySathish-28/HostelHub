import { useEffect, useState } from 'react';
import { getAttendanceRooms, saveAttendance } from '../../services/adminServices';

const MarkAttendance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await getAttendanceRooms();
        setRows(Array.isArray(data) ? data.filter((row) => row.studentID) : []);
      } catch (err) {
        setError('Unable to load attendance list.');
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  const updateStatus = (studentID, value) => {
    setRows((prev) => prev.map((row) => (row.studentID === studentID ? { ...row, status: value } : row)));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    const attendance = rows.map((row) => ({ studentID: row.studentID, status: row.status || 'absent' }));

    try {
      await saveAttendance(attendance);
      setSuccess('Attendance saved successfully.');
    } catch (err) {
      setError('Failed to save attendance. Please try again.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mark Attendance</h1>
        <p style={styles.subtitle}>Only admitted students are shown here, ordered by room number.</p>
      </div>

      {loading ? (
        <div style={styles.message}>Loading admitted students...</div>
      ) : error ? (
        <div style={{ ...styles.message, color: '#b91c1c' }}>{error}</div>
      ) : rows.length === 0 ? (
        <div style={styles.message}>No admitted students found.</div>
      ) : (
        <>
          {success && <div style={{ ...styles.message, backgroundColor: '#d1fae5', color: '#065f46' }}>{success}</div>}
          <div style={styles.tableWrapper}>
            <div style={styles.rowHeader}>
              <div style={styles.cell}>Room</div>
              <div style={styles.cell}>Student ID</div>
              <div style={{ ...styles.cell, flex: 2 }}>Name</div>
              <div style={styles.cell}>Status</div>
            </div>
            {rows.map((row) => (
              <div key={row.studentID} style={styles.row}>
                <div style={styles.cell}>{row.roomNo}</div>
                <div style={styles.cell}>{row.studentID}</div>
                <div style={{ ...styles.cell, flex: 2 }}>{`${row.firstName || ''} ${row.lastName || ''}`.trim() || '-'}</div>
                <div style={styles.cell}>
                  <select value={row.status} onChange={(event) => updateStatus(row.studentID, event.target.value)} style={styles.select}>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <button style={styles.saveButton} onClick={handleSubmit}>Save Attendance</button>
        </>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '30px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    color: '#1f2937',
  },
  subtitle: {
    marginTop: '8px',
    color: '#4b5563',
  },
  message: {
    padding: '18px',
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    color: '#111827',
    textAlign: 'center',
    marginBottom: '20px',
  },
  tableWrapper: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  rowHeader: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#f8fafc',
    color: '#eaebed',
    fontWeight: 700,
  },
  row: {
    display: 'flex',
    padding: '16px',
    alignItems: 'center',
    borderTop: '1px solid #e5e7eb',
  },
  cell: {
    flex: 1,
    minWidth: '90px',
    color: '#aeb9d4',
  },
  select: {
    padding: '8px 10px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  saveButton: {
    marginTop: '20px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default MarkAttendance;