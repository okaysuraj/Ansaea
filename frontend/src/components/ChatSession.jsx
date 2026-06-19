import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatSession({ appointment, onBack }) {
  const { authenticatedFetch } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await authenticatedFetch(`/chat/${appointment.id}/messages`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (err) {
      console.log('Error fetching chat history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    
    // Initialize WebSocket connection
    const wsUrl = `ws://localhost:8000/api/chat/ws/${appointment.id}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setError('');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'typing') {
        setIsTyping(true);
      } else {
        setIsTyping(false);
        setMessages((prev) => {
          // Avoid duplicates if message already exists
          if (!prev.find(m => m.id === data.id)) {
            return [...prev, data];
          }
          return prev;
        });
      }
    };
    
    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError('Connection interrupted');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [appointment.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    const userText = inputText;
    setInputText('');
    
    socket.send(JSON.stringify({ text: userText }));
  };

  return (
    <div className="glass-panel" style={{ height: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Chat Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-glass)', gap: '1rem' }}>
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <img
          src={appointment.doctor_imageUrl}
          alt={appointment.doctor_name}
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />

        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>{appointment.doctor_name}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }}></span>
            Active Session Mode
          </span>
        </div>

        <HeartPulse size={24} style={{ color: 'var(--color-secondary)', marginLeft: 'auto' }} />
      </div>

      {/* Messages Area */}
      <div className="chat-messages-area">
        {isLoading ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>Establishing secure link...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)', padding: '2rem' }}>
            <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Connection established successfully.</p>
            <p style={{ fontSize: '0.8rem' }}>Say "Hello" or share what's on your mind. Dr. Carter is listening.</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </>
        )}

        {/* Doctor Typing Indicator */}
        {isTyping && (
          <div className="chat-bubble doctor" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Typing</span>
            <div className="typing-dots">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-panel" style={{ padding: '0.5rem', margin: '1rem auto', borderColor: 'var(--color-danger)', fontSize: '0.8rem', color: 'var(--color-danger)' }}>
            {error}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="chat-input-bar">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="chat-input"
          placeholder="Share your feelings, doubts, or physical symptoms..."
          disabled={!socket || socket.readyState !== WebSocket.OPEN}
        />
        <button
          type="submit"
          className="btn-send"
          disabled={!inputText.trim() || !socket || socket.readyState !== WebSocket.OPEN}
        >
          <Send size={18} />
        </button>
      </form>
      
    </div>
  );
}
