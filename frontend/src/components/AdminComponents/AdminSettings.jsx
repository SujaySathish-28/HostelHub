import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../store/ThemeContext.jsx';
import './AdminSettings.css';

const AdminSettings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleThemeToggle = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    try {
      const response = await fetch('https://hostelhub-8wba.onrender.com/admin/update-theme', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: newTheme }),
      });

      if (response.ok) {
        toggleTheme();
      } else {
        console.error('Failed to update theme on server');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setStatusType('');

    if (newPassword !== confirmPassword) {
      setStatusMessage('New passwords do not match.');
      setStatusType('error');
      return;
    }

    if (newPassword.length < 6) {
      setStatusMessage('New password must be at least 6 characters long.');
      setStatusType('error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://hostelhub-8wba.onrender.com/admin/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();
      if (response.status === 401) {
        navigate('/sign-in');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update password.');
      }

      setStatusMessage(data.message || 'Password updated successfully.');
      setStatusType('success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      setStatusMessage(error.message);
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="theme-toggle-panel">
        <div className="theme-toggle-info">
          <h2 className="admin-settings-heading">Theme Settings</h2>
          <p className="admin-settings-description">
            Switch the app theme globally. Dark mode makes the whole application easier on the eyes at night, while light mode keeps the interface crisp and bright.
          </p>
        </div>

        <button
          type="button"
          className={`theme-toggle-button ${isDarkMode ? 'active' : ''}`}
          aria-pressed={isDarkMode}
          onClick={handleThemeToggle}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb" />
          </span>
          <span className="theme-toggle-label">{isDarkMode ? 'Dark' : 'Light'}</span>
        </button>
      </div>

      <div className="admin-settings-card">
        <p className="admin-settings-card-text">
          {isDarkMode
            ? 'Dark mode is enabled globally across the app. All supported pages now use a dark background and light text.'
            : 'Light mode is enabled globally across the app. All supported pages now use a bright background and dark text.'}
        </p>
      </div>

      <div className="admin-password-panel">
        <div className="admin-password-card">
          <div className="password-header">
            <div>
              <h3 className="admin-settings-heading">Update Password</h3>
              <p className="admin-settings-description">
                Enter your current password to verify your identity, then choose a new secure password.
              </p>
            </div>
            <button
              type="button"
              className="password-action-button"
              onClick={() => {
                setShowPasswordForm((value) => !value);
                setStatusMessage('');
                setStatusType('');
              }}
            >
              {showPasswordForm ? 'Cancel' : 'Update Password'}
            </button>
          </div>

          {showPasswordForm ? (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <label>
                Old Password
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter current password"
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Choose a new password"
                />
              </label>

              <label>
                Confirm New Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                />
              </label>

              {statusMessage && (
                <div className={`status-message ${statusType}`}>
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                className="password-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;