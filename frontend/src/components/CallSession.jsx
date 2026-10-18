import DailyIframe from '@daily-co/daily-js';
import { Phone, PhoneOff, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function CallSession({ appointment, onClose }) {
  const { authenticatedFetch } = useAuth();
  const [callStatus, setCallStatus] = useState('ringing'); // ringing, connected, ended
  const [callSeconds, setCallSeconds] = useState(0);

  const callContainerRef = useRef(null);
  const callFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const ringIntervalRef = useRef(null);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const startRingtone = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;

      const playRing = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc1.frequency.value = 440;
        osc2.frequency.value = 480;
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.03, ctx.currentTime + 1.5);
        gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.6);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.6);
        osc2.stop(ctx.currentTime + 1.6);
      };

      playRing();
      ringIntervalRef.current = setInterval(playRing, 3500);
    } catch (e) {
      console.error('Audio ringtone failed:', e);
    }
  }, []);

  const stopAudioTracks = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch((e) => console.error(e));
    }
  };

  const answerCall = async () => {
    setCallStatus('connected');
    stopAudioTracks();

    if (callContainerRef.current) {
      callFrameRef.current = DailyIframe.createFrame(callContainerRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
        },
      });

      let dailyUrl = `https://video.ansaea.co/room-${appointment?.id || 'session'}`;
      try {
        const res = await authenticatedFetch(`/video/room/${appointment?.id}`);
        if (res.ok) {
          const data = await res.json();
          dailyUrl = data.url;
        }
      } catch (e) {
        console.error('Failed to get real video room', e);
      }

      await callFrameRef.current.join({ url: dailyUrl });

      callFrameRef.current.on('left-meeting', () => {
        endCall();
      });
    }
  };

  useEffect(() => {
    startRingtone();
    return () => {
      stopAudioTracks();
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
    };
  }, [startRingtone]);

  useEffect(() => {
    if (callStatus !== 'connected') return;
    const timer = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [callStatus]);

  const endCall = () => {
    stopAudioTracks();
    setCallStatus('ended');
    if (callFrameRef.current) {
      callFrameRef.current.leave();
      callFrameRef.current.destroy();
      callFrameRef.current = null;
    }
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26, 26, 24, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 'var(--space-4)',
      }}
    >
      <div
        className="card card-padding"
        style={{
          width: '100%',
          maxWidth: '520px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Encrypted indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-1) var(--space-3)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--status-success)' }} />
          <span>WebRTC P2P Encrypted Call (Ansaea Secure)</span>
        </div>

        {/* Video feed container */}
        <div
          ref={callContainerRef}
          style={{
            width: '100%',
            height: callStatus === 'connected' ? '340px' : '0px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: callStatus === 'connected' ? 'var(--space-4)' : '0',
          }}
        />

        {callStatus !== 'connected' && (
          <div style={{ marginBottom: 'var(--space-4)', position: 'relative' }}>
            <img
              src={
                appointment?.doctor_imageUrl ||
                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
              }
              alt={appointment?.doctor_name || 'Clinician'}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: 'var(--radius-avatar)',
                objectFit: 'cover',
                border: '3px solid var(--accent-subtle)',
                boxShadow: 'var(--shadow-md)',
              }}
            />
          </div>
        )}

        <h3 style={{ margin: 0 }}>{appointment?.doctor_name || 'Dr. Sarah Jenkins'}</h3>
        <p
          className="text-caption"
          style={{ marginTop: 'var(--space-1)', marginBottom: 'var(--space-4)' }}
        >
          {appointment?.doctor_specialty || 'Clinical Consultation'}
        </p>

        {callStatus === 'ringing' && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <span className="badge badge-accent" style={{ animation: 'pulse 2s infinite' }}>
              Incoming Secure Connection...
            </span>
          </div>
        )}

        {callStatus === 'connected' && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span
              className="text-mono"
              style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}
            >
              {formatTime(callSeconds)}
            </span>
          </div>
        )}

        {callStatus === 'ended' && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span className="badge badge-danger">Consultation Concluded</span>
          </div>
        )}

        {/* Action button controls */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {callStatus === 'ringing' ? (
            <>
              <button
                type="button"
                onClick={endCall}
                className="btn btn-danger"
                style={{
                  borderRadius: 'var(--radius-avatar)',
                  width: '56px',
                  height: '56px',
                  padding: 0,
                }}
                title="Decline"
              >
                <PhoneOff size={22} />
              </button>
              <button
                type="button"
                onClick={answerCall}
                className="btn btn-primary"
                style={{
                  borderRadius: 'var(--radius-avatar)',
                  width: '56px',
                  height: '56px',
                  padding: 0,
                }}
                title="Answer Call"
              >
                <Phone size={22} />
              </button>
            </>
          ) : callStatus === 'connected' ? (
            <button
              type="button"
              onClick={endCall}
              className="btn btn-danger"
              style={{
                borderRadius: 'var(--radius-avatar)',
                width: '56px',
                height: '56px',
                padding: 0,
              }}
              title="End Call"
            >
              <PhoneOff size={22} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
