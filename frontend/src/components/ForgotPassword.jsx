import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userName, setUserName] = useState('');

  // Check if we have a reset token in URL
  useState(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    const resetEmail = params.get('email');
    console.log(resetToken,resetEmail)
    const verifyToken = async (resetToken, resetEmail) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/student/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token: resetToken,
          email: resetEmail,
        }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setStep('reset');
        setUserName(data.userName);
        setError('');
      } else {
        setError(data.message || 'Invalid or expired reset link');
      }
    } catch (err) {
      setError('Error verifying reset token: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
    if (resetToken && resetEmail) {
      setToken(resetToken);
      setEmail(resetEmail);
      verifyToken(resetToken, resetEmail);
    }
  }, [location.search]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/student/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset link has been sent to your email. Please check your inbox.');
        setEmail('');
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      } else {
        setError(data.message || 'Error sending reset email');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/student/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token,
          email,
          newPassword: password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigate('/sign-in');
        }, 2000);
      } else {
        setError(data.message || 'Error resetting password');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <div className="forgot-password-logo">
              <h1>HostelHub</h1>
              <p>Student Panel</p>
            </div>
          </div>

          {step === 'email' ? (
            <div className="forgot-password-content">
              <h2>Reset Your Password</h2>
              <p className="forgot-password-subtitle">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handleEmailSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    disabled={loading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="forgot-password-footer">
                <p>
                  Remember your password?{' '}
                  <a href="/sign-in">Sign in</a>
                </p>
              </div>
            </div>
          ) : (
            <div className="forgot-password-content">
              <h2>Create New Password</h2>
              <p className="forgot-password-subtitle">
                Welcome back, <strong>{userName}</strong>! Please enter your new password.
              </p>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handlePasswordReset}>
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={loading}
                    required
                  />
                  <p className="form-hint">Must be at least 6 characters</p>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={loading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="forgot-password-footer">
                <p>
                  <a href="/sign-in">Back to Sign in</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
