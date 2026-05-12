import { useEffect, useState } from 'react';
import { getComplaints, completeComplaint } from '../../services/adminServices';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Unable to load complaints. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleComplete = async (complaintId) => {
    try {
      await completeComplaint(complaintId);
      setComplaints((prev) => prev.filter((item) => item._id !== complaintId));
    } catch (err) {
      setError('Unable to mark complaint completed. Please try again.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Student Complaints</h1>
        <p style={styles.subtitle}>All complaints submitted by students with their stored profile details.</p>
      </div>

      {loading ? (
        <div style={styles.message}>Loading complaints...</div>
      ) : error ? (
        <div style={{ ...styles.message, color: '#b91c1c' }}>{error}</div>
      ) : complaints.length === 0 ? (
        <div style={styles.message}>No complaints found.</div>
      ) : (
        <div style={styles.grid}>
          {complaints.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.studentName}>{item.firstName} {item.lastName}</h2>
                  <p style={styles.meta}>ID: {item.studentID} • Branch: {item.branch} • Year: {item.year}</p>
                </div>
                <span style={styles.status}>{item.status || 'pending'}</span>
              </div>

              <div style={styles.details}>
                <p><strong>Room No:</strong> {item.roomNo}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Submitted:</strong> {new Date(item.createdAt).toLocaleString()}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Complaint</h3>
                <p style={styles.sectionText}>{item.complaint}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Reason</h3>
                <p style={styles.sectionText}>{item.reason}</p>
              </div>

              {item.attachmentName && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Attachment</h3>
                  <p style={styles.sectionText}>{item.attachmentName}</p>
                </div>
              )}

              <div style={styles.actionRow}>
                <button style={styles.completeButton} onClick={() => handleComplete(item._id)}>
                  Mark completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '30px',
    maxWidth: '1180px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
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
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: '#f3f4f6',
    color: '#111827',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
    padding: '22px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '18px',
  },
  studentName: {
    margin: 0,
    fontSize: '22px',
    color: '#111827',
  },
  meta: {
    margin: '8px 0 0',
    color: '#6b7280',
    fontSize: '14px',
  },
  status: {
    fontSize: '13px',
    color: '#0f172a',
    backgroundColor: '#e2e8f0',
    borderRadius: '999px',
    padding: '8px 14px',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  details: {
    display: 'grid',
    gap: '10px',
    marginBottom: '16px',
    color: '#334155',
    fontSize: '15px',
  },
  section: {
    marginTop: '16px',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '16px',
    color: '#111827',
  },
  sectionText: {
    margin: 0,
    lineHeight: 1.75,
    color: '#475569',
    whiteSpace: 'pre-wrap',
  },
  actionRow: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  completeButton: {
    padding: '10px 18px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background-color 0.2s ease',
  },
};

export default AdminComplaints;
