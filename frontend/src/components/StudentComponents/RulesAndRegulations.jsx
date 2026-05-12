import { useEffect, useState } from 'react';
import { getRulesAndRegulations } from '../../services/studentServices.js';

const sectionTabs = [
  { key: 'rule', label: 'Rules' },
  { key: 'regulation', label: 'Regulations' },
];

const RulesAndRegulations = () => {
  const [activeSection, setActiveSection] = useState('rule');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getRulesAndRegulations(activeSection);
      if (data?.message || data?.error) {
        setError(data.message || data.error || 'Unable to load section content.');
        setItems([]);
      } else {
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Unable to load rules and regulations. Please try again later.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [activeSection]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Rules & Regulations</h2>
        <p style={styles.subtitle}>
          Select a section to view the latest hostel rules or regulations in a clean, row-based display.
        </p>
      </div>

      <div style={styles.tabBar}>
        {sectionTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSection(tab.key)}
            style={activeSection === tab.key ? styles.activeTab : styles.tab}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading {activeSection === 'rule' ? 'rules' : 'regulations'}...</div>
      ) : (
        <div style={styles.contentCard}>
          <div style={styles.contentHeader}>
            <h3 style={styles.contentTitle}>{activeSection === 'rule' ? 'Hostel Rules' : 'Hostel Regulations'}</h3>
            <p style={styles.contentDescription}>
              {activeSection === 'rule'
                ? 'Read the rules listed below. Each rule is displayed as a horizontal row.'
                : 'Read the regulations listed below. Each regulation appears in its own row.'}
            </p>
          </div>

          {items.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No {activeSection === 'rule' ? 'rules' : 'regulations'} have been published yet.</p>
            </div>
          ) : (
            <div style={styles.itemRows}>
              {items.map((item, index) => (
                <article key={item._id || index} style={styles.itemRow}>
                  <div style={styles.rowContent}>
                    <h4 style={styles.rowTitle}>{item.title}</h4>
                    <p style={styles.rowDetails}>{item.details}</p>
                  </div>
                  <div style={styles.rowNumber}>{index + 1}</div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '28px',
  },
  header: {
    marginBottom: '22px',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    color: '#111827',
  },
  subtitle: {
    marginTop: '10px',
    color: '#475569',
    fontSize: '16px',
    lineHeight: 1.75,
    maxWidth: '760px',
  },
  tabBar: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  tab: {
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    padding: '12px 20px',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  activeTab: {
    border: '1px solid #2563eb',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '12px 20px',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  loading: {
    padding: '24px',
    borderRadius: '18px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    textAlign: 'center',
    fontSize: '16px',
  },
  error: {
    marginBottom: '20px',
    padding: '16px',
    borderRadius: '14px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
  },
  contentHeader: {
    marginBottom: '18px',
  },
  contentTitle: {
    margin: '0 0 6px 0',
    fontSize: '26px',
    color: '#111827',
  },
  contentDescription: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.7,
  },
  emptyState: {
    padding: '32px',
    borderRadius: '18px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  itemRows: {
    display: 'grid',
    gap: '14px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '18px',
    alignItems: 'flex-start',
    padding: '18px',
    borderRadius: '16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
  },
  rowNumber: {
    minWidth: '40px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    backgroundColor: '#e0f2fe',
    color: '#1d4ed8',
    fontWeight: 700,
    fontSize: '16px',
    border: '1px solid #bfdbfe',
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#111827',
    marginBottom: '8px',
  },
  rowDetails: {
    margin: 0,
    color: '#475569',
    lineHeight: 1.7,
  },
  emptyText: {
    margin: 0,
    color: '#475569',
    fontSize: '16px',
  },
};

export default RulesAndRegulations;
