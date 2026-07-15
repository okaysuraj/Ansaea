import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      setLoading(true);
      setTimeout(() => {
        navigate('/role-selection');
      }, 1500);
    }
  };

  return (
    <div className="auth-premium-wrapper">
      <div className="auth-premium-card">
        <div className="auth-header">
          <div className="auth-logo-box">
            <ShieldAlert size={32} />
          </div>
          <h1 className="auth-title">Verify Identity</h1>
          <p className="auth-subtitle">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              className="otp-input"
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e)}
              onKeyDown={e => handleKeyDown(index, e)}
            />
          ))}
        </div>

        <button 
          className="btn-primary-auth" 
          onClick={handleVerify}
          disabled={otp.join('').length < 6 || loading}
          style={{ marginTop: '2rem' }}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
        
        <div className="auth-footer">
          Didn't receive code? <span className="auth-link">Resend</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .otp-container {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 1.5rem;
        }
        .otp-input {
          width: 50px;
          height: 60px;
          border-radius: 12px;
          border: 1px solid #e5e5e5;
          background: #fafafa;
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          color: #111;
          transition: all 0.2s;
        }
        .otp-input:focus {
          outline: none;
          border-color: #000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }
      `}} />
    </div>
  );
}
