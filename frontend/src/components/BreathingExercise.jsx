import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCw, Wind } from 'lucide-react';

const BREATHING_PRESETS = [
  { name: 'Calming (Equal Box)', inhale: 4, hold: 4, exhale: 4, desc: 'Ideal for stress reduction and restoring emotional balance.' },
  { name: 'Deep Sleep (4-7-8)', inhale: 4, hold: 7, exhale: 8, desc: 'Relaxes the nervous system. Highly recommended before bed.' },
  { name: 'Energizing (3-1-3)', inhale: 3, hold: 1, exhale: 3, desc: 'Increases oxygen flow, clears sleepiness, and sharpens focus.' }
];

export default function BreathingExercise() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState('exhale'); // inhale, hold, exhale
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  
  const preset = BREATHING_PRESETS[selectedPresetIndex];
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  // Play custom synthesized ambient chime/hum
  const playAmbientSound = (phase, duration) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (phase === 'inhale') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        osc.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + duration); // E4
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + duration);
      } else if (phase === 'hold') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + duration);
      } else { // exhale
        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + duration); // C4
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
      }
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      console.log('Web Audio API not allowed/supported:', err);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      setBreathPhase('exhale');
      setSecondsRemaining(preset.exhale);
      return;
    }

    setSecondsRemaining(preset.inhale);
    setBreathPhase('inhale');
    playAmbientSound('inhale', preset.inhale);

  }, [isRunning, selectedPresetIndex]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Transition phase
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            playAmbientSound('hold', preset.hold);
            return preset.hold;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            playAmbientSound('exhale', preset.exhale);
            return preset.exhale;
          } else {
            setCompletedCycles((c) => c + 1);
            setBreathPhase('inhale');
            playAmbientSound('inhale', preset.inhale);
            return preset.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, breathPhase, selectedPresetIndex]);

  const toggleExercise = () => {
    setIsRunning(!isRunning);
    if (isRunning) {
      setCompletedCycles(0);
    }
  };

  const getPhaseInstruction = () => {
    if (breathPhase === 'inhale') return 'Breathe In...';
    if (breathPhase === 'hold') return 'Hold it...';
    return 'Breathe Out...';
  };

  const getSubText = () => {
    if (breathPhase === 'inhale') return 'Feel the clean, oxygenating energy filling your body.';
    if (breathPhase === 'hold') return 'Let the calm settle inside your quiet center.';
    return 'Slowly let go of all the tension and racing thoughts.';
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Wind style={{ color: 'var(--color-success)' }} />
        <h3>Mindful Breathing Guide</h3>
      </div>
      
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Ground your nervous system instantly using deep, rhythmically timed pranayama techniques.
      </p>

      {!isRunning && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {BREATHING_PRESETS.map((p, idx) => (
            <div
              key={p.name}
              onClick={() => setSelectedPresetIndex(idx)}
              className="glass-panel"
              style={{
                padding: '1rem',
                cursor: 'pointer',
                borderColor: selectedPresetIndex === idx ? 'var(--color-success)' : 'transparent',
                background: selectedPresetIndex === idx ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.01)'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: selectedPresetIndex === idx ? 'var(--color-success)' : 'var(--text-primary)' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      )}

      <div className="breath-container">
        <div className="breath-circle-outer">
          <div className={`breath-circle-inner ${isRunning ? breathPhase : 'exhale'}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {isRunning ? breathPhase : 'Ready'}
              </span>
              <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                {isRunning ? secondsRemaining : preset.inhale}s
              </span>
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', height: '1.8em' }}>
          {isRunning ? getPhaseInstruction() : 'Take a comfortable posture'}
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', height: '2.5em', maxWidth: '380px', margin: '0 auto 2rem' }}>
          {isRunning ? getSubText() : 'Choose a breathing pattern above and click Start below.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={toggleExercise}
            className="btn-submit"
            style={{
              width: 'auto',
              padding: '0.8rem 2.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isRunning ? 'var(--color-danger)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: isRunning ? '0 4px 15px rgba(239, 68, 68, 0.2)' : '0 4px 15px rgba(16, 185, 129, 0.2)'
            }}
          >
            {isRunning ? (
              <>
                <Square size={18} /> Stop
              </>
            ) : (
              <>
                <Play size={18} /> Start Breathing
              </>
            )}
          </button>

          {isRunning && (
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0 1.2rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Cycles Completed: <strong style={{ color: 'var(--color-success)', marginLeft: '0.35rem' }}>{completedCycles}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
