import { useEffect, useState } from 'react';
import { createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement } from '../../services/adminServices';

const announcementCategories = ['General', 'Maintenance', 'Event', 'Academic', 'Emergency', 'Other'];

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAnnouncements();
      if (data?.message || data?.error) {
        setError(data.message || data.error || 'Unable to load announcements.');
      } else {
        setAnnouncements(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Unable to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('General');
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

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category: category || 'General',
        photo: photo || '',
      };
      const response = editingId
        ? await updateAnnouncement(editingId, payload)
        : await createAnnouncement(payload);

      if (response?.message && !response._id) {
        setError(response.message);
        return;
      }

      setSuccess(editingId ? 'Announcement updated successfully.' : 'Announcement added successfully.');
      resetForm();
      loadAnnouncements();
    } catch (err) {
      setError('Unable to save announcement.');
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setTitle(announcement.title || '');
    setDescription(announcement.description || '');
    setCategory(announcement.category || 'General');
    setPhoto(announcement.photo || '');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    setError('');
    setSuccess('');
    try {
      const response = await deleteAnnouncement(id);
      if (response?.message?.includes('deleted')) {
        setSuccess('Announcement deleted successfully.');
        loadAnnouncements();
      } else {
        setError(response?.message || 'Unable to delete announcement.');
      }
    } catch (err) {
      setError('Unable to delete announcement.');
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.headerSection}>
        <h2 style={styles.heading}>Announcements Management</h2>
        <p style={styles.subtext}>Create, edit, and remove announcements for students. Add titles, descriptions, and optional photos.</p>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.formPanel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>{editingId ? 'Edit Announcement' : 'Add New Announcement'}</h3>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label} htmlFor="announcementTitle">Title</label>
            <input
              id="announcementTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              placeholder="Enter announcement title"
              required
            />

            <label style={styles.label} htmlFor="announcementCategory">Category</label>
            <select
              id="announcementCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              {announcementCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label style={styles.label} htmlFor="announcementDescription">Description</label>
            <textarea
              id="announcementDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              style={styles.textarea}
              placeholder="Enter the announcement details here..."
              required
            />

            <label style={styles.label} htmlFor="announcementPhoto">Photo (optional)</label>
            <input
              id="announcementPhoto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            {photo && <p style={styles.photoPreview}>✓ Photo selected</p>}

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <div style={styles.buttonRow}>
              <button type="submit" style={styles.primaryButton}>
                {editingId ? 'Update Announcement' : 'Add Announcement'}
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
            <h3 style={styles.panelTitle}>All Announcements ({announcements.length})</h3>
          </div>

          {loading ? (
            <p style={styles.loadingText}>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p style={styles.noItemsText}>No announcements yet. Create your first announcement!</p>
          ) : (
            <div style={styles.listContainer}>
              {announcements.map((announcement) => (
                <div key={announcement._id} style={styles.itemCard}>
                  <div style={styles.itemHeader}>
                    <div style={styles.itemTitleSection}>
                      <h4 style={styles.itemTitle}>{announcement.title}</h4>
                      <span style={styles.itemCategory}>{announcement.category}</span>
                    </div>
                    <p style={styles.itemDate}>
                      {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <p style={styles.itemDescription}>{announcement.description}</p>
                  {announcement.photo && <img src={announcement.photo} alt="Announcement" style={styles.itemPhoto} />}
                  <div style={styles.itemActions}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(announcement._id)}
                    >
                      Delete
                    </button>
                  </div>
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
    backgroundColor: '#f4f7ff',
  },
  headerSection: {
    marginBottom: '24px',
  },
  heading: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 700,
    color: '#111827',
  },
  subtext: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#475569',
    maxWidth: '800px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  formPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e5e7eb',
  },
  listPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e5e7eb',
  },
  panelHeader: {
    marginBottom: '20px',
  },
  panelTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    color: '#111827',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    minHeight: '140px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  fileInput: {
    padding: '10px 0',
    fontSize: '14px',
    color: '#374151',
  },
  photoPreview: {
    fontSize: '14px',
    color: '#059669',
    margin: 0,
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '14px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 700,
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    borderRadius: '14px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 700,
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    margin: 0,
  },
  success: {
    color: '#059669',
    fontSize: '14px',
    margin: 0,
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    maxHeight: 'calc(100vh - 400px)',
    overflowY: 'auto',
  },
  loadingText: {
    fontSize: '15px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  noItemsText: {
    fontSize: '15px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  itemCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '14px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    transition: 'border-color 0.2s',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  itemTitleSection: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flex: 1,
  },
  itemTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#111827',
  },
  itemCategory: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  itemDate: {
    margin: 0,
    fontSize: '12px',
    color: '#9ca3af',
  },
  itemDescription: {
    margin: '8px 0',
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.5',
  },
  itemPhoto: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '12px',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  editButton: {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 600,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  deleteButton: {
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 600,
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default AdminAnnouncements;
