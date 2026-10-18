import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <div className="auth-logo-box">
            <ShieldCheck size={28} />
          </div>
          <h1 className="auth-title">Verify your identity</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0 }}>
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-input"
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <button
          className="btn-primary-auth"
          onClick={handleVerify}
          disabled={otp.join('').length < 6 || loading}
          style={{ marginTop: 'var(--space-6)' }}
        >
          {loading ? 'Verifying...' : 'Verify code'}
        </button>

        <div className="auth-footer">
          No code received? <span className="auth-link">Resend</span>
        </div>
      </div>
    </div>
  );
}
