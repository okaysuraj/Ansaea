import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function RegisterScreen() {
  const { signup, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.username);
      navigate('/role-selection');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-premium-wrapper">
      <div className="auth-premium-card" style={{ maxWidth: '460px' }}>
        <div className="auth-header">
          <div className="auth-logo-box">
            <UserPlus size={32} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Ansaea to access premium healthcare</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Create a strong password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn-primary-auth" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already a member? <span onClick={() => navigate('/login')} className="auth-link">Log in instead</span>
        </div>
      </div>
    </div>
  );
}
