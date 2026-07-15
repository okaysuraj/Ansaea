import React, { useState } from 'react';
import { MessageSquare, Search } from 'lucide-react';
import ChatSession from '../../../components/ChatSession';

export default function MessagesInbox() {
  const [activeChat, setActiveChat] = useState(null);

  // Mock list of active chats
  const mockChats = [
    { id: '1', doctor_name: 'Dr. Sarah Jenkins', doctor_specialty: 'Clinical Psychologist', session_type: 'chat', status: 'upcoming', doctor_imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' },
    { id: '2', doctor_name: 'Dr. Robert Chen', doctor_specialty: 'Psychiatrist', session_type: 'chat', status: 'upcoming', doctor_imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300' }
  ];

  if (activeChat) {
    return (
      <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
         <ChatSession appointment={activeChat} onBack={() => setActiveChat(null)} />
      </div>
    );
  }

  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Messages Inbox</h1>
      </div>
      
      <div className="glass-panel" style={{ display: 'flex', height: '70vh', overflow: 'hidden' }}>
        
        {/* Sidebar list */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-dim)' }} />
              <input type="text" className="form-input" placeholder="Search chats..." style={{ paddingLeft: '2.5rem', padding: '0.75rem 0.75rem 0.75rem 2.5rem' }} />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {mockChats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat)}
                style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', gap: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <img src={chat.doctor_imageUrl} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: '600' }}>{chat.doctor_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tap to open secure chat</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: '#f9fafb' }}>
          <MessageSquare size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
          <h3>Select a conversation</h3>
          <p>End-to-end encrypted messaging.</p>
        </div>

      </div>
    </div>
  );
}
