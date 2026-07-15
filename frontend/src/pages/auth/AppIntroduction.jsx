import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, HeartPulse, ShieldCheck, Video } from 'lucide-react';

export default function AppIntroduction() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Your Health, Connected",
      desc: "Experience healthcare without borders. Connect with top specialists, manage your vitals, and track your well-being in one beautiful platform.",
      icon: <HeartPulse size={80} className="intro-icon" strokeWidth={1} />
    },
    {
      title: "Telemedicine Redefined",
      desc: "High-definition video consultations, instant chat, and secure clinical workspaces designed for modern medical interactions.",
      icon: <Video size={80} className="intro-icon" strokeWidth={1} />
    },
    {
      title: "Uncompromising Privacy",
      desc: "Your data is encrypted end-to-end. We adhere to the strictest medical data standards so you can focus purely on your health.",
      icon: <ShieldCheck size={80} className="intro-icon" strokeWidth={1} />
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="intro-wrapper">
      <div className="intro-glass-card">
        <div className="intro-illustration-container">
          {slides[step].icon}
        </div>
        
        <div className="intro-text-content">
          <h2 className="intro-title">{slides[step].title}</h2>
          <p className="intro-desc">{slides[step].desc}</p>
        </div>

        <div className="intro-controls">
          <div className="intro-dots">
            {slides.map((_, i) => (
              <div key={i} className={`intro-dot ${i === step ? 'active' : ''}`} />
            ))}
          </div>
          <button className="intro-next-btn" onClick={handleNext}>
            {step === slides.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .intro-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f9f9f9;
          background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .intro-glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          padding: 3rem;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: slide-up-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .intro-illustration-container {
          width: 160px;
          height: 160px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          color: #000000;
        }
        .intro-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 1rem;
        }
        .intro-desc {
          font-size: 1.05rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 3rem;
        }
        .intro-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: auto;
        }
        .intro-dots {
          display: flex;
          gap: 8px;
        }
        .intro-dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #d4d4d4;
          transition: all 0.3s;
        }
        .intro-dot.active {
          width: 24px;
          background: #000000;
        }
        .intro-next-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #000000;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .intro-next-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        @keyframes slide-up-fade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
