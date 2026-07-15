import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Volume2 } from 'lucide-react';
import DailyIframe from '@daily-co/daily-js';

export default function CallSession({ appointment, isVideo, onClose }) {
  const [callStatus, setCallStatus] = useState('ringing'); // ringing, connected, ended
  const [callSeconds, setCallSeconds] = useState(0);
  
  const callContainerRef = useRef(null);
  const callFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const ringIntervalRef = useRef(null);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const startRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;

      const playRing = () => {
        if (callStatus !== 'ringing') return;
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
      console.log('Audio ringtone failed:', e);
    }
  };

  const stopAudioTracks = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(e => console.error(e));
    }
  };

  const answerCall = async () => {
    setCallStatus('connected');
    stopAudioTracks();

    // Initialize Daily.co
    if (callContainerRef.current) {
      callFrameRef.current = DailyIframe.createFrame(callContainerRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px'
        }
      });

      // Join the Daily room using a mock or real URL
      const dailyUrl = `https://mock.daily.co/room-${appointment.id}`; // In reality, fetch from our backend
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
  }, []);

  // Connection timer
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
    <div className="call-modal">
      <div className="glass-panel call-card" style={{ width: '100%', maxWidth: '540px', background: 'rgba(10, 15, 30, 0.95)' }}>
        
        {/* Encryption alert banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
          <Volume2 size={12} style={{ color: 'var(--color-success)' }} />
          <span>WebRTC Peer-to-Peer Secure Encrypted Connection (Daily.co)</span>
        </div>

        {/* Video feeds container */}
        <div 
          ref={callContainerRef} 
          style={{ 
            width: '100%', 
            height: callStatus === 'connected' ? '360px' : '0px', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            marginBottom: callStatus === 'connected' ? '1.5rem' : '0' 
          }}
        />

        {callStatus !== 'connected' && (
          <div className="calling-avatar-ring">
            <img
              src={appointment.doctor_imageUrl}
              alt={appointment.doctor_name}
              className="calling-avatar"
              style={{ borderColor: 'var(--color-primary)' }}
            />
          </div>
        )}

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>{appointment.doctor_name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{appointment.doctor_specialty}</p>

        {callStatus === 'ringing' && (
          <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Ansaea Line Ringing...
          </span>
        )}

        {callStatus === 'connected' && (
          <div>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: '700', color: 'white', display: 'block', marginBottom: '0.5rem' }}>
              {formatTime(callSeconds)}
            </span>
          </div>
        )}

        {callStatus === 'ended' && (
          <span style={{ fontSize: '0.9rem', color: 'var(--color-danger)', fontWeight: '600', textTransform: 'uppercase' }}>
            Session Closed
          </span>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
          {callStatus === 'ringing' ? (
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
              <button onClick={endCall} className="btn-call-action decline" title="Decline Call">
                <PhoneOff size={22} />
              </button>
              <button onClick={answerCall} className="btn-call-action accept" title="Answer Call">
                <Phone size={22} />
              </button>
            </div>
          ) : callStatus === 'connected' ? (
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
               <button onClick={endCall} className="btn-call-action decline" style={{ width: '56px', height: '56px' }}>
                <PhoneOff size={22} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
