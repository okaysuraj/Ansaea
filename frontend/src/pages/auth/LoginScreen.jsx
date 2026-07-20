import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity } from 'lucide-react';

export default function LoginScreen() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-premium-wrapper">
      <div className="auth-premium-card">
        <div className="auth-header">
          <div className="auth-logo-box">
            <Activity size={32} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to your Ansaea dashboard</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

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
          
          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot password?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary-auth" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <span onClick={() => navigate('/register')} className="auth-link">Create one now</span>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .auth-premium-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f0f2f5;
          position: relative;
          overflow: hidden;
        }
        .auth-premium-wrapper::before {
          content: '';
          position: absolute;
          top: -20%; left: -10%;
          width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 60%);
          border-radius: 50%;
        }
        .auth-premium-card {
          background: #ffffff;
          width: 100%;
          max-width: 420px;
          padding: 3rem 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          z-index: 1;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .auth-logo-box {
          width: 64px; height: 64px;
          background: #000000;
          color: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .auth-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 0.5rem;
        }
        .auth-subtitle {
          color: #666;
          font-size: 0.95rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
        }
        .label-row a {
          font-size: 0.85rem;
          color: #666;
          text-decoration: none;
        }
        .label-row a:hover {
          color: #000;
        }
        .input-group input {
          width: 100%;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          border: 1px solid #e5e5e5;
          background: #fafafa;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .input-group input:focus {
          outline: none;
          border-color: #000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }
        .btn-primary-auth {
          width: 100%;
          padding: 1rem;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }
        .btn-primary-auth:hover {
          background: #222;
        }
        .btn-primary-auth:disabled {
          background: #666;
        }
        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.95rem;
          color: #666;
        }
        .auth-link {
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }
        .auth-error-banner {
          background: #fef2f2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          text-align: center;
        }
      `}} />
    </div>
  );
}
