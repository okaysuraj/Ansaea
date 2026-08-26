import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PhoneCall, AlertCircle } from 'lucide-react';

const EmergencyContacts = () => {
    const { authenticatedFetch } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await authenticatedFetch('/users/emergency-contacts');
                if (res.ok) setContacts(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [authenticatedFetch]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    
    return (
        <div className="main-content" style={{ padding: '2rem 10%', marginLeft: 0 }}>
            <div className="dashboard-header">
                <h1 className="dashboard-title"><PhoneCall size={28} color="var(--color-danger)" /> Emergency Contacts</h1>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', marginBottom: '2rem', fontWeight: 'bold' }}>
                    <AlertCircle size={20} />
                    If you are experiencing a life-threatening emergency, please call your local emergency services immediately.
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {contacts.map((c, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', borderLeft: '4px solid var(--color-danger)' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{c.name}</span>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>{c.type}</div>
                            </div>
                            <a href={`tel:${c.phone}`} className="action-btn primary" style={{ backgroundColor: 'var(--color-danger)', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <PhoneCall size={16} /> {c.phone}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmergencyContacts;
