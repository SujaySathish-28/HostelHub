import { useEffect, useState } from 'react';
import {
  getRulesRegulations,
  createRuleRegulation,
  updateRuleRegulation,
  deleteRuleRegulation,
} from '../../services/adminServices.js';

const tabs = [
  { key: 'rule', label: 'Rules' },
  { key: 'regulation', label: 'Regulations' },
];

const RulesRegulations = () => {
  const [activeTab, setActiveTab] = useState('rule');
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRulesRegulations(activeTab);
      if (data?.message || data?.error) {
        setError(data.message || data.error || 'Unable to load items.');
        setItems([]);
      } else {
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Unable to load items.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const resetForm = () => {
    setTitle('');
    setDetails('');
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !details.trim()) {
      setError('Both title and description are required.');
      return;
    }

    const payload = {
      itemType: activeTab,
      title: title.trim(),
      details: details.trim(),
    };

    try {
      const response = editingId
        ? await updateRuleRegulation(editingId, payload)
        : await createRuleRegulation(payload);

      if (response?.message && !response._id) {
        setError(response.message);
        return;
      }

      setSuccess(editingId ? 'Item updated successfully.' : 'Item added successfully.');
      resetForm();
      loadItems();
    } catch (err) {
      setError('Unable to save item.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title || '');
    setDetails(item.details || '');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setError('');
    setSuccess('');
    try {
      const response = await deleteRuleRegulation(id);
      if (response?.message?.includes('deleted')) {
        setSuccess('Item removed successfully.');
        if (editingId === id) {
          resetForm();
        }
        loadItems();
      } else {
        setError(response?.message || 'Unable to delete item.');
      }
    } catch (err) {
      setError('Unable to delete item.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Rules & Regulations</h2>
        <p style={styles.subtitle}>
          Manage the hostel rules and regulations separately. Use the tabs to switch between rules and regulations.
        </p>
      </div>

      <div style={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key);
              resetForm();
            }}
            style={activeTab === tab.key ? styles.activeTab : styles.tab}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>{editingId ? 'Edit item' : `Create ${activeTab === 'rule' ? 'Rule' : 'Regulation'}`}</h3>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label} htmlFor="itemTitle">Title</label>
            <input
              id="itemTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              placeholder={`Enter ${activeTab === 'rule' ? 'rule' : 'regulation'} title`}
            />

            <label style={styles.label} htmlFor="itemDetails">Description</label>
            <textarea
              id="itemDetails"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              style={styles.textarea}
              rows={6}
              placeholder={`Describe the ${activeTab === 'rule' ? 'rule' : 'regulation'}`}
            />

            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}

            <div style={styles.buttonRow}>
              <button type="submit" style={styles.primaryButton}>
                {editingId ? 'Update' : 'Add'} {activeTab === 'rule' ? 'Rule' : 'Regulation'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={styles.secondaryButton}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>{activeTab === 'rule' ? 'Rules list' : 'Regulations list'}</h3>
          </div>
          {loading ? (
            <div style={styles.emptyState}>Loading {activeTab === 'rule' ? 'rules' : 'regulations'}...</div>
          ) : items.length === 0 ? (
            <div style={styles.emptyState}>
              <h4 style={styles.emptyTitle}>No {activeTab === 'rule' ? 'rules' : 'regulations'} yet</h4>
              <p style={styles.emptyText}>Add one using the form on the left to begin managing this section.</p>
            </div>
          ) : (
            <div style={styles.itemList}>
              {items.map((item) => (
                <article key={item._id} style={styles.itemCard}>
                  <div style={styles.itemHeader}>
                    <div>
                      <h4 style={styles.itemTitle}>{item.title}</h4>
                      <p style={styles.itemMeta}>Created on {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={styles.itemActions}>
                      <button type="button" style={styles.editButton} onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button type="button" style={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={styles.itemDetails}>{item.details}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '28px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    margin: 0,
    color: '#79859f',
  },
  subtitle: {
    marginTop: '10px',
    color: '#475569',
    fontSize: '16px',
    lineHeight: 1.7,
  },
  tabBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  tab: {
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    padding: '12px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  activeTab: {
    border: '1px solid #2563eb',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '12px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    gap: '24px',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 20px 45px rgba(30, 34, 45, 0.06)',
  },
  panelHeader: {
    marginBottom: '18px',
  },
  panelTitle: {
    margin: 0,
    color: '#111827',
    fontSize: '22px',
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  label: {
    fontSize: '14px',
    color: '#4b5563',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#d7dbe3',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    padding: '14px',
    fontSize: '15px',
    color: '#b9c9e9',
    resize: 'vertical',
    minHeight: '180px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 22px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    color: '#2563eb',
    border: '1px solid #c7d2fe',
    borderRadius: '14px',
    padding: '12px 22px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: '12px 14px',
    borderRadius: '12px',
  },
  success: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
    padding: '12px 14px',
    borderRadius: '12px',
  },
  itemList: {
    display: 'grid',
    gap: '18px',
  },
  itemCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '18px',
    padding: '20px',
    backgroundColor: '#f8fafc',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  itemTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#111827',
  },
  itemMeta: {
    margin: '6px 0 0 0',
    color: '#6b7280',
    fontSize: '14px',
  },
  itemActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  editButton: {
    border: '1px solid #2563eb',
    backgroundColor: '#ffffff',
    color: '#2563eb',
    borderRadius: '12px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  deleteButton: {
    border: '1px solid #ef4444',
    backgroundColor: '#ffffff',
    color: '#ef4444',
    borderRadius: '12px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 700,
  },
  itemDetails: {
    margin: 0,
    color: '#334155',
    lineHeight: 1.8,
  },
  emptyState: {
    border: '1px solid #e5e7eb',
    borderRadius: '18px',
    padding: '24px',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
  },
  emptyTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: '#111827',
  },
  emptyText: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.7,
  },
};

export default RulesRegulations;
