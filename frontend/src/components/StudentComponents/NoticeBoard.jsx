import { useEffect, useState } from 'react'
import { getNoticeBoard } from '../../services/studentServices.js'

const NoticeBoard = () => {
  const [notices, setNotices] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await getNoticeBoard()
        if (response?.success === false) {
          throw new Error(response.message || 'Failed to load notices')
        }
        setNotices(response || [])
      } catch (err) {
        setError(err.message || 'Unable to fetch notices')
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading notice board...</div>
  }

  if (error) {
    return <div style={{ padding: '24px', color: 'red' }}>Error: {error}</div>
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f7ff', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#0f172a' }}>Student Notice Board</h2>
          <p style={{ marginTop: '10px', color: '#475569', fontSize: '16px', maxWidth: '720px' }}>
            Browse the latest notices, announcements, and alerts. Images are shown directly when available.
          </p>
        </div>

        {notices.length === 0 ? (
          <div style={{ padding: '32px', borderRadius: '18px', backgroundColor: '#ffffff', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)', color: '#6b7280', textAlign: 'center' }}>
            No notices are available right now.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px', maxHeight: '74vh', overflowY: 'auto', paddingRight: '10px' }}>
            {notices.map((notice) => {
              const createdAt = new Date(notice.createdAt)
              return (
                <article key={notice._id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
                  {notice.photo && (
                    <div style={{ width: '100%', minHeight: '180px', overflow: 'hidden' }}>
                      <img
                        src={notice.photo}
                        alt={notice.type || 'Notice photo'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ display: 'inline-block', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '999px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {notice.type || 'Notice'}
                        </span>
                        <h3 style={{ margin: '12px 0 0 0', fontSize: '22px', color: '#111827', lineHeight: 1.2 }}>
                          {notice.title || 'Important update'}
                        </h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{createdAt.toLocaleDateString()}</p>
                        <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '13px' }}>{createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    <p style={{ margin: 0, color: '#334155', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                      {notice.details || 'No details available for this notice.'}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', color: '#64748b', fontSize: '13px' }}>
                      <span>Posted by {notice.createdBy || 'Admin'}</span>
                      <span>{notice._id ? `ID: ${notice._id.slice(-6).toUpperCase()}` : null}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NoticeBoard
