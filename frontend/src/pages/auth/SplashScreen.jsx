import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to intro after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/intro');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo-container">
          <Activity size={64} className="splash-icon" />
        </div>
        <h1 className="splash-title">Ansaea</h1>
        <p className="splash-subtitle">Premium Healthcare Platform</p>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .splash-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #000000;
          color: white;
          overflow: hidden;
        }
        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .splash-logo-container {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          animation: pulse-glow 2s infinite alternate;
        }
        .splash-icon {
          color: white;
        }
        .splash-title {
          font-family: var(--font-display, 'Outfit', sans-serif);
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #ffffff, #a3a3a3);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .splash-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 1.1rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
          100% { box-shadow: 0 0 40px rgba(255,255,255,0.3); }
        }
      `}} />
    </div>
  );
}
