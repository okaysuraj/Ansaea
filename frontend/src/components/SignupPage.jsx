import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../landing.css';

export default function SignupPage({ onNavigateToLogin }) {
  const { register, error, setError } = useAuth();
  
  // Notice we include password to ensure it matches the backend, even though prototype omitted it
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [formLoading, setFormLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    // We use fullName as username for the backend, since the backend expects username
    const success = await register(fullName, email, password, role);
    
    setFormLoading(false);
    if (success) {
      setVerificationSent(true);
    }
  };

  return (
    <div className="signup-layout">
      <div className="signup-container">
        
        {/* Left Side: Value Prop Sidebar */}
        <div className="signup-sidebar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '40px', width: 'auto' }} />
              <h1 className="auth-form-logo" style={{ textAlign: 'left', margin: 0 }}>Ansaea</h1>
            </div>
            <p className="font-headline-lg" style={{ color: 'var(--color-surface-variant)', fontWeight: 300, maxWidth: '28rem', lineHeight: 1.2 }}>
              Precision health for human longevity.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="signup-val-prop">
              <div className="signup-val-icon">
                <span className="material-symbols-outlined">biotech</span>
              </div>
              <div>
                <h3 className="font-headline-lg" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>100+ biomarkers</h3>
                <p style={{ color: 'var(--color-surface-variant)', maxWidth: '24rem' }}>Comprehensive blood analysis mapping your complete physiological state.</p>
              </div>
            </div>
            
            <div className="signup-val-prop">
              <div className="signup-val-icon">
                <span className="material-symbols-outlined">clinical_notes</span>
              </div>
              <div>
                <h3 className="font-headline-lg" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>One personalized plan</h3>
                <p style={{ color: 'var(--color-surface-variant)', maxWidth: '24rem' }}>Actionable protocols driven by your unique data and clinical science.</p>
              </div>
            </div>
            
            <div className="signup-val-prop">
              <div className="signup-val-icon">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <h3 className="font-headline-lg" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>$199/year</h3>
                <p style={{ color: 'var(--color-surface-variant)', maxWidth: '24rem' }}>Transparent annual pricing. HSA/FSA eligible.</p>
              </div>
            </div>
          </div>
          
          <div style={{ paddingTop: '2rem' }}>
            <img 
              alt="Clinical Visualization" 
              className="signup-image" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTVMKEF_HTKwf3mUjgfWWDC_2Ml3TA-KiPjLyDL_LUkZfkcG5hPN4_4o6HDe_UOHaCiUJs7TNbA0MrSnlN05A-b6vU_c7y6nhbNyFhTgC0Hi5JmqQVwg5n1HoG1cbjc8UAsAWoQcS2B1mPa6-FULba0aOKtDJd96UfQGGpHaT-r4yGvzcs64peZ3AmtjJKxLuwhb5ceb4GYIn49d6oex69rurXZ9t592A4O02h5g_L5LnVnBfsUm8t4vlLl7pXvZwJP2R1BycuoHCq"
            />
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="signup-form-wrapper">
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} className="signup-mobile-logo">
            <img src="/favicon.png" alt="Ansaea Logo" style={{ height: '32px', width: 'auto' }} />
            <h1 className="auth-form-logo" style={{ margin: 0 }}>Ansaea</h1>
          </div>
          
          <div className="signup-form-card">
            <h2 className="signup-form-title">Start your journey to longevity</h2>
            
            {error && (
              <div style={{ backgroundColor: 'rgba(186, 26, 26, 0.1)', color: '#ba1a1a', padding: '1rem', borderRadius: '8px', fontSize: '14px', textAlign: 'center', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {verificationSent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-primary-landing)' }}>mark_email_read</span>
                </div>
                <h3 className="font-headline-lg" style={{ marginBottom: '1rem' }}>Check your email</h3>
                <p style={{ color: 'var(--color-surface-variant)', marginBottom: '2rem' }}>
                  We've sent a verification link to <strong>{email}</strong>. Please click the link to verify your account before logging in.
                </p>
                <button onClick={onNavigateToLogin} className="signup-btn">
                  Go to Login
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Role Toggle */}
              <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f3f3', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--color-border-subtle)' }}>
                <button 
                  type="button"
                  onClick={() => setRole('user')}
                  style={{ 
                    flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                    background: role === 'user' ? '#ffffff' : 'transparent',
                    color: role === 'user' ? '#000000' : 'var(--color-surface-variant)',
                    boxShadow: role === 'user' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Patient
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('doctor')}
                  style={{ 
                    flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                    background: role === 'doctor' ? '#ffffff' : 'transparent',
                    color: role === 'doctor' ? '#000000' : 'var(--color-surface-variant)',
                    boxShadow: role === 'doctor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Clinician
                </button>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="fullName">Full name</label>
                <input 
                  id="fullName" 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="auth-input" 
                  placeholder="Jane Doe" 
                  required 
                />
              </div>
              
              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="email">Email address</label>
                <input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input" 
                  placeholder="jane@example.com" 
                  required 
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="password">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input" 
                  placeholder="••••••••••••" 
                  required 
                />
              </div>
              
              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="zipCode">Zip code</label>
                <div className="signup-input-wrapper">
                  <input 
                    id="zipCode" 
                    type="text" 
                    pattern="[0-9]{5}"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="auth-input" 
                    placeholder="10001" 
                    required 
                  />
                  <span className="material-symbols-outlined signup-input-icon" style={{ fontSize: '16px' }}>location_on</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-surface-variant)', marginTop: '0.25rem', opacity: 0.7 }}>
                  To verify lab partner availability in your area.
                </p>
              </div>
              
              <div style={{ paddingTop: '1.5rem' }}>
                <button type="submit" disabled={formLoading} className="signup-btn">
                  {formLoading ? (
                    <>
                      <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Become a member</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', transition: 'transform 0.2s' }}>arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            )}
            
            <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.5rem' }}>
              <p style={{ color: 'var(--color-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Already have an account? 
                <button 
                  onClick={onNavigateToLogin}
                  style={{ color: 'var(--color-primary-landing)', fontWeight: 500, textDecoration: 'underline', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <span>Log in</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>login</span>
                </button>
              </p>
            </div>
          </div>
          
          <div className="signup-footer-text">
            By continuing, you agree to our Terms of Service and Privacy Policy. Secure SSL encrypted transaction.
          </div>
        </div>
      </div>
    </div>
  );
}
