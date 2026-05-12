const MessMenuManager = ({ menu = [] }) => {
  return (
    <article className="dashboard-article">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Mess Menu Manager</h2>
          <p className="article-subtitle">Update the weekly meal plan for students</p>
        </div>
        <span className="article-badge">{menu.length} days</span>
      </div>

      <div className="mess-grid">
        {menu.map((item) => (
          <div key={item.day} className="mess-card">
            <div className="mess-card-head">
              <h3 className="mess-day">{item.day}</h3>
              <span className="mess-badge">Weekly</span>
            </div>
            <div className="meal-row">
              <span className="meal-label">Breakfast</span>
              <p className="meal-text">{item.breakfast}</p>
            </div>
            <div className="meal-row">
              <span className="meal-label">Lunch</span>
              <p className="meal-text">{item.lunch}</p>
            </div>
            <div className="meal-row">
              <span className="meal-label">Dinner</span>
              <p className="meal-text">{item.dinner}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default MessMenuManager;
