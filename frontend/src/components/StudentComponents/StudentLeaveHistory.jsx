import { useEffect, useState } from 'react';
import { getStudentLeaveHistory } from '../../services/studentServices';

const StudentLeaveHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getStudentLeaveHistory();
        if (response?.message || response?.error) {
          setError(response.message || response.error || 'Unable to load leave history.');
        } else {
          setHistory(response.leaveHistory || []);
        }
      } catch (err) {
        setError('Unable to load leave history.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>My Leave History</h2>
        <p style={styles.message}>Loading leave history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>My Leave History</h2>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Leave History</h2>
      {history.length === 0 ? (
        <p style={styles.message}>No leave history found yet.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <div style={styles.cellLarge}>Leave Out</div>
            <div style={styles.cellLarge}>Return</div>
            <div style={styles.cellWide}>Address</div>
            <div style={styles.cell}>Status</div>
          </div>
          {history.map((record, index) => (
            <div key={`${record.outDate}-${index}`} style={styles.row}>
              <div style={styles.cellLarge}>{record.outDate}</div>
              <div style={styles.cellLarge}>{record.inDate}</div>
              <div style={styles.cellWide}>{record.addressWhileOnLeave}</div>
              <div style={styles.cell}>{record.status || 'returned'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '28px',
    minHeight: 'calc(100vh - 120px)',
    maxWidth: '980px',
    margin: '0 auto',
    backgroundColor: '#f5f7ff',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '28px',
    color: '#111827',
  },
  message: {
    fontSize: '16px',
    color: '#4b5563',
  },
  error: {
    fontSize: '16px',
    color: '#b91c1c',
  },
  tableWrapper: {
    display: 'grid',
    gap: '12px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '160px 160px 1fr 120px',
    gap: '12px',
    padding: '16px',
    borderRadius: '14px',
    backgroundColor: '#eef2ff',
    fontWeight: 700,
    color: '#1d4ed8',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '160px 160px 1fr 120px',
    gap: '12px',
    padding: '18px 16px',
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
  },
  cellLarge: {
    fontSize: '15px',
    color: '#111827',
  },
  cellWide: {
    fontSize: '15px',
    color: '#374151',
    wordBreak: 'break-word',
  },
  cell: {
    fontSize: '15px',
    color: '#374151',
    textAlign: 'right',
  },
};

export default StudentLeaveHistory;
