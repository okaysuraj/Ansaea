import { Activity } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/intro', { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo-container">
          <Activity size={40} />
        </div>
        <h1 className="splash-title">Ansaea</h1>
        <p className="splash-subtitle">Healthcare Platform</p>
      </div>
    </div>
  );
}
