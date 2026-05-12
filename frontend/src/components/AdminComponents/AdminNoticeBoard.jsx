import { useEffect, useState } from 'react';
import { createNotice, deleteNotice, getNoticeBoard, updateNotice } from '../../services/adminServices';

const noticeTypes = ['General', 'Maintenance', 'Event', 'Alert', 'Other'];

const AdminNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [type, setType] = useState('General');
  const [details, setDetails] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getNoticeBoard();
      if (data?.message || data?.error) {
        setError(data.message || data.error || 'Unable to load notices.');
      } else {
        setNotices(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Unable to load notices.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType('General');
    setDetails('');
    setPhoto('');
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhoto('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!type.trim() || !details.trim()) {
      setError('Type and details are required.');
      return;
    }

    try {
      const payload = { type: type.trim(), details: details.trim(), photo: photo || '' };
      const response = editingId ? await updateNotice(editingId, payload) : await createNotice(payload);
      if (response?.message && !response._id) {
        setError(response.message);
        return;
      }

      setSuccess(editingId ? 'Notice updated successfully.' : 'Notice added successfully.');
      resetForm();
      loadNotices();
    } catch (err) {
      setError('Unable to save notice.');
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setType(notice.type || 'General');
    setDetails(notice.details || '');
    setPhoto(notice.photo || '');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    setError('');
    setSuccess('');
    try {
      const response = await deleteNotice(id);
      if (response?.message?.includes('deleted')) {
        setSuccess('Notice deleted successfully.');
        loadNotices();
      } else {
        setError(response?.message || 'Unable to delete notice.');
      }
    } catch (err) {
      setError('Unable to delete notice.');
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.headerSection}>
        <h2 style={styles.heading}>Admin Notice Board</h2>
        <p style={styles.subtext}>Create, edit, and remove notices for students. Photos are optional.</p>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.formPanel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>{editingId ? 'Edit Notice' : 'Add New Notice'}</h3>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label} htmlFor="noticeType">Notice Type</label>
            <select
              id="noticeType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={styles.select}
            >
              {noticeTypes.map((noticeType) => (
                <option key={noticeType} value={noticeType}>
                  {noticeType}
                </option>
              ))}
            </select>

            <label style={styles.label} htmlFor="noticeDetails">Details</label>
            <textarea
              id="noticeDetails"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              style={styles.textarea}
              placeholder="Enter the notice details here..."
              required
            />

            <label style={styles.label} htmlFor="noticePhoto">Photo (optional)</label>
            <input
              id="noticePhoto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            {photo && (
              <div style={styles.photoPreviewWrapper}>
                <img src={photo} alt="Notice" style={styles.photoPreview} />
              </div>
            )}

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <div style={styles.buttonRow}>
              <button type="submit" style={styles.primaryButton}>
                {editingId ? 'Update Notice' : 'Add Notice'}
              </button>
              {editingId && (
                <button type="button" style={styles.secondaryButton} onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.listPanel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Current Notices</h3>
          </div>
          {loading ? (
            <p style={styles.message}>Loading notices...</p>
          ) : notices.length === 0 ? (
            <p style={styles.message}>No notices have been posted yet.</p>
          ) : (
            <div style={styles.noticeList}>
              {notices.map((notice) => (
                <div key={notice._id} style={styles.noticeCard}>
                  <div style={styles.noticeCardHeader}>
                    <div>
                      <p style={styles.noticeType}>{notice.type}</p>
                      <p style={styles.noticeDate}>{new Date(notice.createdAt).toLocaleString()}</p>
                    </div>
                    <div style={styles.actionButtons}>
                      <button style={styles.editButton} onClick={() => handleEdit(notice)} type="button">
                        Edit
                      </button>
                      <button style={styles.deleteButton} onClick={() => handleDelete(notice._id)} type="button">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={styles.noticeDetails}>{notice.details}</p>
                  {notice.photo && (
                    <div style={styles.noticeImageWrapper}>
                      <img src={notice.photo} alt="Notice" style={styles.noticeImage} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    padding: '28px',
    minHeight: 'calc(100vh - 120px)',
    backgroundColor: '#eef2ff',
  },
  headerSection: {
    marginBottom: '24px',
  },
  heading: {
    margin: 0,
    fontSize: '32px',
    color: '#111827',
  },
  subtext: {
    marginTop: '8px',
    color: '#4b5563',
    fontSize: '16px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.3fr',
    gap: '24px',
  },
  formPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
  },
  listPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
  },
  panelHeader: {
    marginBottom: '18px',
  },
  panelTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#111827',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  },
  select: {
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#ffffff',
  },
  textarea: {
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    padding: '12px 14px',
    minHeight: '150px',
    resize: 'vertical',
    fontSize: '15px',
    color: '#6896fa',
  },
  fileInput: {
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    padding: '10px 14px',
    fontSize: '15px',
    color: '#111827',
  },
  photoPreviewWrapper: {
    maxWidth: '100%',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    display: 'block',
    borderRadius: '14px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 22px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  secondaryButton: {
    padding: '12px 22px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#111827',
    cursor: 'pointer',
    fontWeight: 600,
  },
  error: {
    color: '#b91c1c',
    margin: 0,
  },
  success: {
    color: '#047857',
    margin: 0,
  },
  message: {
    color: '#475569',
    fontSize: '15px',
  },
  noticeList: {
    display: 'grid',
    gap: '16px',
  },
  noticeCard: {
    padding: '18px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  noticeCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  noticeType: {
    margin: 0,
    fontWeight: 700,
    color: '#1d4ed8',
  },
  noticeDate: {
    margin: '6px 0 0 0',
    color: '#64748b',
    fontSize: '13px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    border: '1px solid #2563eb',
    borderRadius: '12px',
    padding: '8px 14px',
    background: '#ffffff',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: 600,
  },
  deleteButton: {
    border: '1px solid #ef4444',
    borderRadius: '12px',
    padding: '8px 14px',
    background: '#ffffff',
    color: '#ef4444',
    cursor: 'pointer',
    fontWeight: 600,
  },
  noticeDetails: {
    color: '#334155',
    lineHeight: 1.75,
    marginBottom: '14px',
  },
  noticeImageWrapper: {
    overflow: 'hidden',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
  },
  noticeImage: {
    width: '100%',
    objectFit: 'cover',
    display: 'block',
  },
};

export default AdminNoticeBoard;
