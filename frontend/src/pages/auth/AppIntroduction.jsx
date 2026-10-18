import { ChevronRight, HeartPulse, ShieldCheck, Video } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AppIntroduction() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Your health, connected',
      desc: 'Connect with specialists, manage vitals, and track your well-being in one place.',
      icon: <HeartPulse size={56} strokeWidth={1.5} />,
    },
    {
      title: 'Modern consultations',
      desc: 'Video calls, instant messaging, and secure clinical workspaces for you and your doctor.',
      icon: <Video size={56} strokeWidth={1.5} />,
    },
    {
      title: 'Private by design',
      desc: 'End-to-end encryption and strict medical data standards protect every interaction.',
      icon: <ShieldCheck size={56} strokeWidth={1.5} />,
    },
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/landing', { replace: true });
    }
  };

  return (
    <div className="intro-container">
      <div className="intro-card">
        <div className="intro-illustration">{slides[step].icon}</div>

        <h2 className="intro-title">{slides[step].title}</h2>
        <p className="intro-description">{slides[step].desc}</p>

        <div className="intro-dots">
          {slides.map((_, i) => (
            <div key={i} className={`intro-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        <div className="intro-actions">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button className="btn btn-primary" onClick={handleNext}>
            {step === slides.length - 1 ? 'Get started' : 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
