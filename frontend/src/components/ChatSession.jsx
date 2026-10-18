import { ArrowLeft, Lock, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { apiUrl } from '../utils/api';
import { decryptMessage, encryptMessage } from '../utils/encryption';

export default function ChatSession({ appointment, onBack }) {
  const { authenticatedFetch, token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    let active = true;
    const fetchMessages = async () => {
      try {
        const response = await authenticatedFetch(`/chat/${appointment.id}/messages`);
        const data = await response.json();
        if (response.ok) {
          const decryptedMsgs = await Promise.all(
            data.map(async (msg) => ({
              ...msg,
              text: await decryptMessage(msg.text),
            })),
          );
          if (active) setMessages(decryptedMsgs);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchMessages();
    return () => {
      active = false;
    };
  }, [appointment.id, authenticatedFetch]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const wsUrl = apiUrl(`/chat/ws/${appointment.id}`).replace(/^http/, 'ws');
    const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
    const ws = new WebSocket(`${wsUrl}${tokenParam}`);

    ws.onopen = () => {
      setSocket(ws);
      setError('');
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'typing') {
          setIsTyping(true);
        } else {
          setIsTyping(false);
          const decryptedData = { ...data, text: await decryptMessage(data.text) };
          setMessages((prev) => {
            if (!prev.find((m) => m.id === decryptedData.id)) {
              return [...prev, decryptedData];
            }
            return prev;
          });
        }
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
      setError('Connection interrupted');
    };

    ws.onclose = () => {
      setSocket((previous) => (previous === ws ? null : previous));
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [appointment.id, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    const userText = inputText;
    setInputText('');

    const encryptedText = await encryptMessage(userText);
    socket.send(JSON.stringify({ text: encryptedText, original_for_ai: userText }));
  };

  return (
    <div
      className="card"
      style={{ height: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Chat Header */}
      <div
        className="flex items-center gap-3"
        style={{
          padding: 'var(--space-4) var(--space-5)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button onClick={onBack} className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <img
          src={appointment.doctor_imageUrl}
          alt={appointment.doctor_name}
          className="avatar avatar-md"
          style={{ borderRadius: '50%' }}
        />

        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.9375rem', margin: 0 }}>{appointment.doctor_name}</h4>
          <span
            className="flex items-center gap-1 text-caption"
            style={{ color: 'var(--status-success)', fontSize: '0.6875rem' }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--status-success)',
                display: 'inline-block',
              }}
            ></span>
            Active
          </span>
        </div>

        <span className="badge badge-success flex items-center gap-1">
          <Lock size={10} />
          Encrypted
        </span>
      </div>

      {/* Messages Area */}
      <div className="chat-messages-area">
        {isLoading ? (
          <div className="text-caption" style={{ textAlign: 'center', margin: 'auto' }}>
            Connecting...
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state" style={{ margin: 'auto' }}>
            <p
              style={{
                fontWeight: 500,
                marginBottom: 'var(--space-2)',
                color: 'var(--text-primary)',
              }}
            >
              Session ready
            </p>
            <p className="empty-state-description">
              Start the conversation. Your messages are end-to-end encrypted.
            </p>
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

        {isTyping && (
          <div className="chat-bubble doctor flex items-center gap-2">
            <span className="text-caption">Typing</span>
            <div className="typing-dots">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="auth-error-banner"
            style={{ margin: 'var(--space-3) auto', maxWidth: '300px' }}
          >
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
          placeholder="Type a message..."
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
