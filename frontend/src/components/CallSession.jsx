import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, ShieldAlert } from 'lucide-react';

export default function CallSession({ appointment, isVideo, onClose }) {
  const [callStatus, setCallStatus] = useState('ringing'); // ringing, connected, ended
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideo);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const signalingSocketRef = useRef(null);
  
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

  const setupWebRTC = async () => {
    try {
      // 1. Get Local Media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: true
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // 2. Setup Signaling WebSocket
      const wsUrl = `ws://localhost:8000/api/chat/webrtc/${appointment.id}`;
      const ws = new WebSocket(wsUrl);
      signalingSocketRef.current = ws;

      // 3. Setup Peer Connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionRef.current = pc;

      // Add local tracks to PC
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle incoming remote tracks
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', answer }));
        } else if (data.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === 'candidate') {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      };

      ws.onopen = async () => {
        // Create offer to initiate call
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: 'offer', offer }));
      };
      
    } catch (err) {
      console.error("WebRTC Error:", err);
      // Fallback if media devices fail (e.g. no camera/mic permissions in dev)
    }
  };

  const answerCall = async () => {
    setCallStatus('connected');
    stopAudioTracks();
    await setupWebRTC();
  };

  useEffect(() => {
    startRingtone();
    return () => {
      stopAudioTracks();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (signalingSocketRef.current) {
        signalingSocketRef.current.close();
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
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (signalingSocketRef.current) {
      signalingSocketRef.current.close();
    }
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => t.enabled = isMuted);
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => t.enabled = !isVideoOn);
    }
    setIsVideoOn(!isVideoOn);
  };

  return (
    <div className="call-modal">
      <div className="glass-panel call-card" style={{ width: '100%', maxWidth: '540px', background: 'rgba(10, 15, 30, 0.95)' }}>
        
        {/* Encryption alert banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
          <Volume2 size={12} style={{ color: 'var(--color-success)' }} />
          <span>WebRTC Peer-to-Peer Secure Encrypted Connection</span>
        </div>

        {/* Video feeds */}
        {callStatus === 'connected' && isVideoOn ? (
          <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-glass)', marginBottom: '1.5rem', background: '#000' }}>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              poster={appointment.doctor_imageUrl}
            />
            {/* Local Video PiP */}
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '80px', height: '110px', borderRadius: '8px', background: 'var(--bg-sidebar)', border: '2px solid rgba(255,255,255,0.5)', overflow: 'hidden' }}>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />
            </div>
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', color: 'white', fontWeight: 'bold' }}>
              LIVE
            </div>
          </div>
        ) : (
          <div className="calling-avatar-ring">
            <img
              src={appointment.doctor_imageUrl}
              alt={appointment.doctor_name}
              className="calling-avatar"
              style={{ borderColor: callStatus === 'connected' ? 'var(--color-success)' : 'var(--color-primary)' }}
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
              <button
                onClick={toggleMute}
                className="glass-panel"
                style={{
                  width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.02)',
                  borderColor: isMuted ? 'var(--color-danger)' : 'var(--border-glass)',
                  color: isMuted ? 'var(--color-danger)' : 'white'
                }}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button onClick={endCall} className="btn-call-action decline" style={{ width: '56px', height: '56px' }}>
                <PhoneOff size={22} />
              </button>

              <button
                onClick={toggleVideo}
                className="glass-panel"
                style={{
                  width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: !isVideoOn ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.02)',
                  borderColor: !isVideoOn ? 'var(--color-danger)' : 'var(--border-glass)',
                  color: !isVideoOn ? 'var(--color-danger)' : 'white'
                }}
              >
                {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
