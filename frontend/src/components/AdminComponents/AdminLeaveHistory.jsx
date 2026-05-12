import React, { useEffect, useState } from 'react';
import { getLeaveHistoryStudents, getLeaveHistoryByStudent } from '../../services/adminServices';

const AdminLeaveHistory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [historyCache, setHistoryCache] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getLeaveHistoryStudents();
        setStudents(result);
      } catch (err) {
        console.error('Error fetching leave history students:', err);
        setError('Unable to load student list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleHistory = async (studentID) => {
    if (expandedStudentId === studentID) {
      setExpandedStudentId(null);
      return;
    }

    setError('');
    setExpandedStudentId(studentID);

    if (historyCache[studentID]) {
      return;
    }

    setLoadingHistory(true);
    try {
      const historyResponse = await getLeaveHistoryByStudent(studentID);
      setHistoryCache((prev) => ({ ...prev, [studentID]: historyResponse.leaveHistory || [] }));
    } catch (err) {
      console.error('Error fetching leave history for student:', err);
      setError('Unable to load leave history. Please try again.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const renderLeaveHistory = (studentID) => {
    const leaveHistory = historyCache[studentID] || [];
    if (loadingHistory && expandedStudentId === studentID) {
      return (
        <div style={styles.historyRow}>
          <p style={styles.historyEmpty}>Loading leave history...</p>
        </div>
      );
    }

    if (!leaveHistory.length) {
      return (
        <div style={styles.historyRow}>
          <p style={styles.historyEmpty}>No leave history available for this student.</p>
        </div>
      );
    }

    return (
      <div style={styles.historyRow}>
        <div style={styles.historyGrid}>
          <div style={styles.historyHeader}>Out Date</div>
          <div style={styles.historyHeader}>In Date</div>
          <div style={styles.historyHeader}>Address While On Leave</div>
          {leaveHistory.map((record, recordIndex) => (
            <React.Fragment key={recordIndex}>
              <div style={styles.historyCell}>{formatDate(record.outDate)}</div>
              <div style={styles.historyCell}>{formatDate(record.inDate)}</div>
              <div style={styles.historyCell}>{record.addressWhileOnLeave}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Leave History</h2>
      {error && <div style={styles.errorBanner}>{error}</div>}
      {loading ? (
        <div style={styles.emptyState}>Loading student list...</div>
      ) : (
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <div style={styles.headerCell}>Name</div>
            <div style={styles.headerCell}>Student ID</div>
            <div style={styles.headerCell}>Room No</div>
            <div style={styles.headerCell}>Branch</div>
            <div style={styles.headerCell}>Year</div>
            <div style={styles.headerCell}>History</div>
          </div>
          {students.length ? (
            students.map((student) => (
              <div key={student.studentID}>
                <div style={styles.tableRow}>
                  <div style={styles.cell}>{student.firstName} {student.lastName}</div>
                  <div style={styles.cell}>{student.studentID}</div>
                  <div style={styles.cell}>{student.roomNo}</div>
                  <div style={styles.cell}>{student.branch}</div>
                  <div style={styles.cell}>{student.year}</div>
                  <div style={styles.cell}>
                    <button
                      type="button"
                      onClick={() => toggleHistory(student.studentID)}
                      style={styles.toggleButton}
                    >
                      {expandedStudentId === student.studentID ? 'Hide History' : 'View History'}
                    </button>
                  </div>
                </div>
                {expandedStudentId === student.studentID && renderLeaveHistory(student.studentID)}
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No admitted students found.</div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#1f2937',
  },
  errorBanner: {
    marginBottom: '18px',
    padding: '14px 18px',
    borderRadius: '14px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5',
    fontWeight: 600,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)',
    overflowX: 'auto',
  },
  tableHeader: {
    display: 'flex',
    backgroundColor: '#eef2ff',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '700',
    color: '#334155',
    minWidth: '980px',
    flexWrap: 'nowrap',
  },
  headerCell: {
    flex: '1 0 140px',
    padding: '16px 18px',
    minWidth: '140px',
    whiteSpace: 'nowrap',
  },
  tableRow: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    minWidth: '980px',
    flexWrap: 'nowrap',
  },
  cell: {
    flex: '1 0 140px',
    padding: '16px 18px',
    minWidth: '140px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  toggleButton: {
    padding: '10px 16px',
    minWidth: '120px',
    borderRadius: '999px',
    border: '1px solid #3b82f6',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  },
  historyRow: {
    backgroundColor: '#f8fafc',
    padding: '16px 24px 24px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  historyGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr',
    gap: '12px',
    width: '100%',
    alignItems: 'start',
  },
  historyHeader: {
    fontWeight: 700,
    color: '#0f172a',
    paddingBottom: '8px',
  },
  historyCell: {
    padding: '10px 12px',
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#334155',
    wordBreak: 'break-word',
  },
  historyEmpty: {
    margin: 0,
    color: '#475569',
    fontSize: '15px',
  },
  emptyState: {
    padding: '28px',
    color: '#64748b',
    textAlign: 'center',
    fontSize: '17px',
  },
};

export default AdminLeaveHistory;
