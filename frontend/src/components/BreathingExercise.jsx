import { CheckCircle2, Play, Square, Wind } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const BREATHING_PRESETS = [
  {
    name: 'Box Breathing (4-4-4)',
    inhale: 4,
    hold: 4,
    exhale: 4,
    desc: 'Calms the nervous system and rapidly restores emotional equilibrium.',
  },
  {
    name: 'Deep Rest (4-7-8)',
    inhale: 4,
    hold: 7,
    exhale: 8,
    desc: 'Activates parasympathetic vagal tone. Ideal for evening decompression.',
  },
  {
    name: 'Coherent Breath (5-0-5)',
    inhale: 5,
    hold: 0,
    exhale: 5,
    desc: 'Optimizes heart rate variability (HRV) and mental clarity.',
  },
];

export default function BreathingExercise() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breath, setBreath] = useState({ phase: 'exhale', seconds: 4, cycles: 0 });
  const { phase: breathPhase, seconds: secondsRemaining, cycles: completedCycles } = breath;

  const preset = BREATHING_PRESETS[selectedPresetIndex];
  const audioCtxRef = useRef(null);

  // Synthesized harmonic chime
  const playAmbientSound = useCallback((phase, duration) => {
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
        gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + duration);
      } else if (phase === 'hold') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + duration);
      } else {
        // exhale
        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + duration); // C4
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
      }

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio optional
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setBreath((previous) => {
        if (previous.seconds > 1) return { ...previous, seconds: previous.seconds - 1 };
        const phase =
          previous.phase === 'inhale'
            ? preset.hold > 0
              ? 'hold'
              : 'exhale'
            : previous.phase === 'hold'
              ? 'exhale'
              : 'inhale';
        return {
          phase,
          seconds: preset[phase],
          cycles: previous.cycles + (previous.phase === 'exhale' ? 1 : 0),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, preset]);

  useEffect(() => {
    if (isRunning) playAmbientSound(breathPhase, preset[breathPhase]);
  }, [isRunning, breathPhase, preset, playAmbientSound]);

  useEffect(
    () => () => {
      audioCtxRef.current?.close().catch(() => {});
    },
    [],
  );

  const toggleExercise = () => {
    setBreath({ phase: 'inhale', seconds: preset.inhale, cycles: 0 });
    setIsRunning((running) => !running);
  };

  const getPhaseInstruction = () => {
    if (breathPhase === 'inhale') return 'Breathe In Slowly';
    if (breathPhase === 'hold') return 'Hold Gently';
    return 'Release and Exhale';
  };

  const getSubText = () => {
    if (breathPhase === 'inhale')
      return 'Draw breath into your diaphragm, relaxing your shoulders.';
    if (breathPhase === 'hold') return 'Rest quietly in the stillness between breaths.';
    return 'Let the breath fall away naturally without forcing.';
  };

  return (
    <div className="card card-padding" style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
        }}
      >
        <div className="stat-icon" style={{ width: '36px', height: '36px' }}>
          <Wind size={18} />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>Neuro-Somatic Breath Guide</h3>
          <span className="text-caption">
            Guided respiration protocols for vagal nerve regulation
          </span>
        </div>
      </div>

      {!isRunning && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-3)',
            margin: 'var(--space-4) 0',
          }}
        >
          {BREATHING_PRESETS.map((p, idx) => {
            const isSelected = selectedPresetIndex === idx;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedPresetIndex(idx)}
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-subtle)' : 'var(--surface-2)',
                  border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  {p.name}
                </div>
                <div className="text-caption" style={{ lineHeight: '1.4' }}>
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="breath-container">
        <div className="breath-circle-outer">
          <div className={`breath-circle-inner ${isRunning ? breathPhase : 'exhale'}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                className="text-label"
                style={{ marginBottom: 'var(--space-1)', color: 'inherit' }}
              >
                {isRunning ? breathPhase : 'Ready'}
              </span>
              <span
                className="text-mono"
                style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}
              >
                {isRunning ? secondsRemaining : preset.inhale}s
              </span>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: 'var(--space-1)' }}>
          {isRunning ? getPhaseInstruction() : 'Find a comfortable upright posture'}
        </h3>

        <p
          className="text-caption"
          style={{ maxWidth: '420px', margin: '0 auto var(--space-6)', lineHeight: '1.5' }}
        >
          {isRunning
            ? getSubText()
            : 'Select a clinical protocol above and begin your guided session.'}
        </p>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={toggleExercise}
            className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'}`}
            style={{ padding: '0.75rem 2rem' }}
          >
            {isRunning ? (
              <>
                <Square size={16} /> End Session
              </>
            ) : (
              <>
                <Play size={16} /> Begin Breathing
              </>
            )}
          </button>

          {isRunning && (
            <span
              className="badge badge-success"
              style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem' }}
            >
              <CheckCircle2 size={14} /> Completed Cycles: <strong>{completedCycles}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
