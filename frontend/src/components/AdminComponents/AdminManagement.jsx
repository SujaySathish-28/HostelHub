const AdminManagement = ({ admins = [] }) => {
  const getInitials = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <article className="dashboard-article">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Admin Management</h2>
          <p className="article-subtitle">Keep your administrator team in sync</p>
        </div>
        <span className="article-badge">{admins.length} admins</span>
      </div>

      <div className="space-y-4">
        {admins.map((admin) => (
          <div key={admin.id} className="admin-item">
            <div className="admin-item-main">
              <div className="admin-item-avatar">{getInitials(admin.name)}</div>
              <div>
                <p className="admin-item-name">{admin.name}</p>
                <p className="admin-item-role">{admin.role}</p>
              </div>
            </div>
            <div className="admin-item-meta">
              <p className="admin-item-meta-label">Last login</p>
              <p className="admin-item-meta-value">{admin.lastLogin}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default AdminManagement;
