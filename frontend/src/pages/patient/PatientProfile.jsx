import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, CreditCard, Link2, Watch, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PatientProfile() {
  const { user, authenticatedFetch } = useAuth();
  const [walletBalance, setWalletBalance] = useState(user?.wallet_balance || 0);
  const [abhaId, setAbhaId] = useState(user?.abha_number || '');
  const [topupAmount, setTopupAmount] = useState('');

  const handleTopup = async () => {
    // Mock top up logic
    alert('Top up initiated');
  };

  return (
    <div className="main-content" style={{ marginLeft: 0, padding: '2rem 10%' }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Profile & Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {user?.username?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user?.username}</h2>
              <p style={{ color: '#666' }}>{user?.email}</p>
            </div>
          </div>

          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} /> Wallet & Payments
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#16a34a' }}>
            ₹{walletBalance.toFixed(2)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="number" className="form-input" placeholder="Amount (₹)" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} />
            <button className="btn-submit" style={{ marginTop: 0 }} onClick={handleTopup}>Top Up</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={18} /> National Health ID (ABHA)
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" className="form-input" placeholder="ABHA ID" value={abhaId} onChange={(e) => setAbhaId(e.target.value)} />
              <button className="btn-submit" style={{ marginTop: 0 }}>Link</button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Watch size={18} /> Wearables Integration
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn-submit" style={{ background: '#f8fafc', color: '#000', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Apple Health</span> <span>Sync</span>
              </button>
              <button className="btn-submit" style={{ background: '#f8fafc', color: '#000', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Fitbit</span> <span>Sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
