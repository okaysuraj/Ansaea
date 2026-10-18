import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function RegisterScreen() {
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        navigate('/role-selection');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <div className="auth-logo-box">
            <UserPlus size={28} />
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            Get started with Ansaea
          </p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn-primary-auth" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="auth-link">
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}
