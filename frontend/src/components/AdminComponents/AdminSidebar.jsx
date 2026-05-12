const AdminSidebar = ({ navItems = [], selectedKey, adminProfile }) => {
  const displayedProfile = adminProfile || {};
  const adminName = `${displayedProfile.firstName || ''} ${displayedProfile.lastName || ''}`.trim() || 'Admin';

  return (
    <div>
      <div className="sidebar-header">
        <div className="sidebar-logo">A</div>
        <div className="sidebar-title">
          <p className="sidebar-label">HostelHub</p>
          <h2 className="sidebar-name">{adminName}</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = item.title === selectedKey;
          return (
            <a
              key={item.title}
              href={item.path}
              className={`nav-button ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.title}</span>
            </a>
          );
        })}
      </nav>

      <div className="sidebar-help">
        <p className="help-label">Need help?</p>
        <h3 className="help-title">Contact support</h3>
        <p className="help-description">Reach out to the hostel admin team for urgent facility or student support.</p>
      </div>
    </div>
  );
};

export default AdminSidebar;
