import { useEffect, useState } from 'react'
import { createAlert, deleteAlert, getAlerts, updateAlert } from '../../services/adminServices.js'

const alertTypes = ['General', 'Safety', 'Maintenance', 'Emergency', 'Other']

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [type, setType] = useState('General')
  const [details, setDetails] = useState('')
  const [photo, setPhoto] = useState('')
  const [targetStudentID, setTargetStudentID] = useState('')
  const [targetStudentName, setTargetStudentName] = useState('')
  const [targetRoomNo, setTargetRoomNo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAlerts()
      if (data?.message || data?.error) {
        setError(data.message || data.error || 'Unable to load alerts.')
      } else {
        setAlerts(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      setError('Unable to load alerts.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setType('General')
    setDetails('')
    setPhoto('')
    setTargetStudentID('')
    setTargetStudentName('')
    setTargetRoomNo('')
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setPhoto('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(reader.result || '')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!type.trim() || !details.trim()) {
      setError('Type and details are required.')
      return
    }

    try {
      const payload = {
        type: type.trim(),
        details: details.trim(),
        photo: photo || '',
        targetStudentID: targetStudentID.trim() || '',
        targetStudentName: targetStudentName.trim() || '',
        targetRoomNo: targetRoomNo.trim() || '',
      }
      const response = editingId ? await updateAlert(editingId, payload) : await createAlert(payload)
      if (response?.message && !response._id) {
        setError(response.message)
        return
      }

      setSuccess(editingId ? 'Alert updated successfully.' : 'Alert created successfully.')
      resetForm()
      loadAlerts()
    } catch (err) {
      setError('Unable to save alert.')
    }
  }

  const handleEdit = (alert) => {
    setEditingId(alert._id)
    setType(alert.type || 'General')
    setDetails(alert.details || '')
    setPhoto(alert.photo || '')
    setTargetStudentID(alert.targetStudentID || '')
    setTargetStudentName(alert.targetStudentName || '')
    setTargetRoomNo(alert.targetRoomNo || '')
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alert?')) return
    setError('')
    setSuccess('')
    try {
      const response = await deleteAlert(id)
      if (response?.message?.includes('deleted')) {
        setSuccess('Alert deleted successfully.')
        loadAlerts()
      } else {
        setError(response?.message || 'Unable to delete alert.')
      }
    } catch (err) {
      setError('Unable to delete alert.')
    }
  }

  return (
    <div style={styles.outerContainer}>
      <div style={styles.headerSection}>
        <h2 style={styles.heading}>Admin Alerts</h2>
        <p style={styles.subtext}>Create, edit, and remove student alerts with optional images.</p>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.formPanel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>{editingId ? 'Edit Alert' : 'Create Alert'}</h3>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label} htmlFor="alertType">Alert Type</label>
            <select id="alertType" value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
              {alertTypes.map((alertType) => (
                <option key={alertType} value={alertType}>
                  {alertType}
                </option>
              ))}
            </select>

            <label style={styles.label} htmlFor="targetStudentID">Student ID</label>
            <input
              id="targetStudentID"
              type="text"
              value={targetStudentID}
              onChange={(e) => setTargetStudentID(e.target.value)}
              style={styles.input}
              placeholder="Enter the student ID (optional)"
            />

            <label style={styles.label} htmlFor="targetStudentName">Student Name</label>
            <input
              id="targetStudentName"
              type="text"
              value={targetStudentName}
              onChange={(e) => setTargetStudentName(e.target.value)}
              style={styles.input}
              placeholder="Enter the student name (optional)"
            />

            <label style={styles.label} htmlFor="targetRoomNo">Room No.</label>
            <input
              id="targetRoomNo"
              type="text"
              value={targetRoomNo}
              onChange={(e) => setTargetRoomNo(e.target.value)}
              style={styles.input}
              placeholder="Enter the student's room number (optional)"
            />

            <label style={styles.label} htmlFor="alertDetails">Details</label>
            <textarea
              id="alertDetails"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              style={styles.textarea}
              placeholder="Describe the alert here..."
              required
            />

            <label style={styles.label} htmlFor="alertPhoto">Photo (optional)</label>
            <input id="alertPhoto" type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />
            {photo && (
              <div style={styles.photoPreviewWrapper}>
                <img src={photo} alt="Alert preview" style={styles.photoPreview} />
              </div>
            )}

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <div style={styles.buttonRow}>
              <button type="submit" style={styles.primaryButton}>
                {editingId ? 'Update Alert' : 'Create Alert'}
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
            <h3 style={styles.panelTitle}>Current Alerts</h3>
          </div>
          {loading ? (
            <p style={styles.message}>Loading alerts...</p>
          ) : alerts.length === 0 ? (
            <p style={styles.message}>No alerts have been created yet.</p>
          ) : (
            <div style={styles.alertList}>
              {alerts.map((alert) => (
                <div key={alert._id} style={styles.alertCard}>
                  <div style={styles.alertCardHeader}>
                    <div>
                      <p style={styles.alertType}>{alert.type}</p>
                      <p style={styles.alertDate}>{new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                    <div style={styles.actionButtons}>
                      <button style={styles.editButton} onClick={() => handleEdit(alert)} type="button">
                        Edit
                      </button>
                      <button style={styles.deleteButton} onClick={() => handleDelete(alert._id)} type="button">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={styles.alertDetails}>{alert.details}</p>
                  <p style={styles.targetInfo}>
                    <strong>Target:</strong> {alert.targetStudentName || 'Unknown'} ({alert.targetStudentID || 'N/A'}) — Room {alert.targetRoomNo || 'N/A'}
                  </p>
                  {alert.photo && (
                    <div style={styles.alertImageWrapper}>
                      <img src={alert.photo} alt="Alert" style={styles.alertImage} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
    gridTemplateColumns: '1fr 1.4fr',
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
    color: '#a7acb6',
  },
  select: {
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#c4cad6',
  },
  input: {
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#111827',
  },
  textarea: {
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    padding: '12px 14px',
    minHeight: '150px',
    resize: 'vertical',
    fontSize: '15px',
    color: '#a8b0c1',
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
    color: '#b5bed2',
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
  alertList: {
    display: 'grid',
    gap: '16px',
  },
  alertCard: {
    padding: '18px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  alertCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  alertType: {
    margin: 0,
    fontWeight: 700,
    color: '#c026d3',
  },
  alertDate: {
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
  alertDetails: {
    color: '#334155',
    lineHeight: 1.75,
    marginBottom: '14px',
  },
  targetInfo: {
    color: '#475569',
    fontSize: '14px',
    margin: '0 0 14px 0',
  },
  alertImageWrapper: {
    overflow: 'hidden',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
  },
  alertImage: {
    width: '100%',
    objectFit: 'cover',
    display: 'block',
  },
}

export default AdminAlerts;