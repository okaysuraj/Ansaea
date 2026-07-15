import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Real implementation would call auth API
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="auth-premium-wrapper">
      <div className="auth-premium-card">
        <div className="auth-header">
          <div className="auth-logo-box">
            <KeyRound size={32} />
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">We'll send you a link to reset your password</p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#16a34a' }}>Check your email</h3>
            <p style={{ color: '#666', lineHeight: 1.5 }}>
              We've sent password reset instructions to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary-auth">
              Send Reset Link
            </button>
          </form>
        )}
        
        {!submitted && (
          <div className="auth-footer">
            Remembered your password? <span onClick={() => navigate('/login')} className="auth-link">Back to login</span>
          </div>
        )}
      </div>
    </div>
  );
}
