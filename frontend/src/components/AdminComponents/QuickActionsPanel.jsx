const QuickActionsPanel = ({ actions = [] }) => {
  return (
    <article className="dashboard-article">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Quick Actions</h2>
          <p className="article-subtitle">One-click shortcuts for everyday admin tasks</p>
        </div>
        <span className="article-badge">{actions.length} available</span>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button key={action.title} className="quick-action-card group">
            <div className="quick-action-icon">
              <span>{action.icon}</span>
            </div>
            <div className="quick-action-body">
              <p className="quick-action-title">{action.title}</p>
              <p className="quick-action-description">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </article>
  );
};

export default QuickActionsPanel;
