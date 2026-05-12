import { useEffect, useState } from 'react'
import { getStudentAlerts } from '../../services/studentServices.js'

const StudentAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await getStudentAlerts()
        if (response?.message || response?.error) {
          throw new Error(response.message || response.error || 'Unable to load alerts')
        }
        setAlerts(Array.isArray(response) ? response : [])
      } catch (err) {
        setError(err.message || 'Unable to fetch alerts')
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
  }, [])

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading alerts...</div>
  }

  if (error) {
    return <div style={{ padding: '24px', color: 'red' }}>Error: {error}</div>
  }

  return (
    <div style={{ padding: '28px', minHeight: 'calc(100vh - 80px)', backgroundColor: '#eef2ff' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ marginBottom: '26px' }}>
          <h2 style={{ margin: 0, fontSize: '34px', color: '#0f172a' }}>Student Alerts</h2>
          <p style={{ marginTop: '10px', color: '#475569', fontSize: '16px', maxWidth: '760px' }}>
            All active alerts from the administration are shown here. Tap any alert to review details and see images when available.
          </p>
        </div>

        {alerts.length === 0 ? (
          <div style={{ padding: '32px', borderRadius: '22px', backgroundColor: '#ffffff', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)', color: '#64748b', textAlign: 'center' }}>
            No alerts are available right now.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#334155', fontSize: '15px' }}>{alerts.length} alert{alerts.length === 1 ? '' : 's'} active</span>
              <span style={{ color: '#475569', fontSize: '14px' }}>Most recent alerts appear first.</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', paddingRight: '8px' }}>
              {alerts.map((alert) => {
                const createdAt = new Date(alert.createdAt)
                const typeColor = alert.type === 'Maintenance' ? '#f97316' : alert.type === 'Event' ? '#0ea5e9' : alert.type === 'Alert' ? '#ef4444' : '#4338ca'
                return (
                  <article key={alert._id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: '26px', boxShadow: '0 20px 48px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
                    {alert.photo && (
                    <div style={{ width: '100%', minHeight: '210px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                      <img
                        src={alert.photo}
                        alt={alert.type || 'Alert image'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: '#ffffff', backgroundColor: typeColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {alert.type || 'Alert'}
                          </span>
                          <h3 style={{ margin: '14px 0 0 0', fontSize: '24px', color: '#111827', lineHeight: 1.2 }}>{alert.type ? `${alert.type} Alert` : 'Important Alert'}</h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{createdAt.toLocaleDateString()}</p>
                          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '13px' }}>{createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>

                      <p style={{ margin: 0, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line', flex: 1 }}>
                        {alert.details || 'No details provided.'}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', color: '#64748b', fontSize: '13px' }}>
                        <span>Posted by {alert.createdBy || 'Administration'}</span>
                        <span>{alert._id ? `Ref ${alert._id.slice(-6).toUpperCase()}` : ''}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StudentAlerts;
