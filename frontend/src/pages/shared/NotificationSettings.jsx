import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Smartphone, Mail, MessageSquare, Calendar, Pill } from 'lucide-react';

export default function NotificationSettings() {
    const { authenticatedFetch } = useAuth();
    const [settings, setSettings] = useState({
        push_enabled: true,
        email_enabled: true,
        sms_enabled: false,
        appointment_alerts: true,
        medication_alerts: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await authenticatedFetch('/patients/notifications');
                if (res.ok) setSettings(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [authenticatedFetch]);

    const handleToggle = async (key) => {
        const newValue = !settings[key];
        setSettings(prev => ({ ...prev, [key]: newValue }));
        
        try {
            await authenticatedFetch('/patients/notifications', {
                method: 'PUT',
                body: JSON.stringify({ ...settings, [key]: newValue })
            });
        } catch (e) {
            console.error(e);
            setSettings(prev => ({ ...prev, [key]: !newValue })); // revert
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>;

    return (
        <div className="main-content" style={{ padding: '2rem 10%', marginLeft: 0 }}>
            <div className="dashboard-header">
                <h1 className="dashboard-title"><Bell size={28} /> Notification Settings</h1>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Delivery Channels</h3>
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="habit-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Smartphone size={20} /> Push Notifications</div>
                        <input type="checkbox" checked={settings.push_enabled} onChange={() => handleToggle('push_enabled')} style={{ transform: 'scale(1.5)' }} />
                    </div>
                    <div className="habit-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Mail size={20} /> Email Notifications</div>
                        <input type="checkbox" checked={settings.email_enabled} onChange={() => handleToggle('email_enabled')} style={{ transform: 'scale(1.5)' }} />
                    </div>
                    <div className="habit-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><MessageSquare size={20} /> SMS Notifications</div>
                        <input type="checkbox" checked={settings.sms_enabled} onChange={() => handleToggle('sms_enabled')} style={{ transform: 'scale(1.5)' }} />
                    </div>
                </div>

                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Alert Types</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="habit-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Calendar size={20} /> Appointments</div>
                        <input type="checkbox" checked={settings.appointment_alerts} onChange={() => handleToggle('appointment_alerts')} style={{ transform: 'scale(1.5)' }} />
                    </div>
                    <div className="habit-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Pill size={20} /> Medications</div>
                        <input type="checkbox" checked={settings.medication_alerts} onChange={() => handleToggle('medication_alerts')} style={{ transform: 'scale(1.5)' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}