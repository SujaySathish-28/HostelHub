const NoticeBoard = ({ notices = [] }) => {
  return (
    <article className="dashboard-article notice-board-card">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Notice Board</h2>
          <p className="article-subtitle">Publish and review current notices</p>
        </div>
        <span className="article-badge">{notices.length} active</span>
      </div>

      <div className="space-y-4 notice-list">
        {notices.map((notice) => (
          <div key={notice.label} className="notice-card">
            <div className="notice-card-top">
              <div className="notice-pill">{notice.label}</div>
              <div className="notice-status">Live</div>
            </div>
            <p className="notice-content">{notice.message}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default NoticeBoard;
