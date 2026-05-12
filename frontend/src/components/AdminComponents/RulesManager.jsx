const RulesManager = ({ rules = [] }) => {
  return (
    <article className="dashboard-article">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Rules Manager</h2>
          <p className="article-subtitle">Maintain hostel regulations and communicate them quickly</p>
        </div>
        <span className="article-badge">{rules.length} rules</span>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="rule-card">
            <div className="rule-card-header">
              <div>
                <h3 className="rule-title">{rule.title}</h3>
                <p className="rule-description">{rule.description}</p>
              </div>
              <span className="rule-chip">{rule.id}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default RulesManager;
