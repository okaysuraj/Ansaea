import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <div className="auth-logo-box">
            <KeyRound size={28} />
          </div>
          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            We'll send a reset link to your email
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
            <div className="auth-success-banner">
              Reset instructions sent to <strong>{email}</strong>
            </div>
            <p className="text-caption" style={{ marginTop: 'var(--space-4)' }}>
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary-auth">
              Send reset link
            </button>
          </form>
        )}

        {!submitted && (
          <div className="auth-footer">
            Remember your password?{' '}
            <span onClick={() => navigate('/login')} className="auth-link">
              Sign in
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
