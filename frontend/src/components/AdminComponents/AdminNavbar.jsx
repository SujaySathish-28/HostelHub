const AdminNavbar = ({ profileName = 'Admin', role = 'Administrator', alertsCount = 0, adminProfile }) => {
  const displayedProfile = adminProfile || {};
  const adminName = `${displayedProfile.firstName || ''} ${displayedProfile.lastName || ''}`.trim() || profileName;
  const profileImage = displayedProfile.profilePhoto || 'https://via.placeholder.com/80?text=AD';

  return (
    <header className="dashboard-header">
      <div className="header-welcome">
        <p className="welcome-label">Welcome back,</p>
        <h1 className="welcome-name">{adminName}</h1>
        <p className="welcome-description">{role} · {alertsCount} new alerts waiting</p>
      </div>
      <div className="header-actions">
        <button className="notification-btn">
          <span className="text-lg">🔔</span>
        </button>
        <div className="profile-info">
          <img
            src={profileImage}
            alt="Admin profile"
            className="profile-avatar"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80?text=AD'; }}
          />
          <div className="profile-text">
            <p className="profile-role">{role}</p>
            <p className="profile-name">{adminName}</p>
          </div>
        </div>
        <button className="logout-btn">
          <span className="text-lg">↪</span>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
