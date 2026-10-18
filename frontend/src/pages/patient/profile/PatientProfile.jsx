import { ArrowUpRight, CheckCircle2, CreditCard, Link2, Watch } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../context/useAuth';

export default function PatientProfile() {
  const { user } = useAuth();
  const [walletBalance] = useState(user?.wallet_balance || 245.0);
  const [abhaId, setAbhaId] = useState(user?.abha_number || 'ABHA-9921-4819-2041');
  const [topupAmount, setTopupAmount] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  const handleTopup = (e) => {
    e.preventDefault();
    if (!topupAmount) return;
    setSyncStatus('Funds credited to wellness account.');
    setTopupAmount('');
    setTimeout(() => setSyncStatus(''), 4000);
  };

  const handleSyncWearable = (device) => {
    setSyncStatus(`${device} biometrics synchronized.`);
    setTimeout(() => setSyncStatus(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <span className="text-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
            Account Credentials
          </span>
          <h1>My Profile & Connected Accounts</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Manage biometrics devices, healthcare identity credentials, and consultation billing.
          </p>
        </div>
      </div>

      {syncStatus && (
        <div
          className="badge badge-success"
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={15} /> {syncStatus}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {/* Left Card: User Identity & Wallet */}
        <div className="card card-padding">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <div
              className="avatar avatar-lg"
              style={{
                background: 'var(--accent-subtle)',
                color: 'var(--accent)',
                fontSize: '1.5rem',
                fontWeight: '700',
              }}
            >
              {user?.username?.substring(0, 2).toUpperCase() || 'PT'}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{user?.username || 'Patient'}</h3>
              <p className="text-caption" style={{ marginTop: '2px' }}>
                {user?.email || 'patient@ansaea.health'}
              </p>
              <span className="badge badge-accent" style={{ marginTop: 'var(--space-2)' }}>
                Verified Member
              </span>
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-4)',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              marginBottom: 'var(--space-5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-2)',
              }}
            >
              <span className="text-label">Wellness Wallet Balance</span>
              <CreditCard size={16} style={{ color: 'var(--accent)' }} />
            </div>
            <div
              className="text-mono"
              style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}
            >
              ${walletBalance.toFixed(2)}
            </div>
            <span className="text-caption">Eligible for HSA/FSA reimbursement</span>
          </div>

          <form onSubmit={handleTopup} style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Amount ($)"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Add Funds
            </button>
          </form>
        </div>

        {/* Right Column: Health ID & Wearables */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* ABHA / National Health ID */}
          <div className="card card-padding">
            <h4
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-1)',
              }}
            >
              <Link2 size={16} /> National Health Registry (ABHA)
            </h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Secure token linking your federal digital health record repository.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="text"
                className="form-input text-mono"
                placeholder="ABHA ID"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
              />
              <button type="button" className="btn btn-secondary">
                Linked
              </button>
            </div>
          </div>

          {/* Wearables */}
          <div className="card card-padding">
            <h4
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-1)',
              }}
            >
              <Watch size={16} /> Wearables & Biosensors
            </h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Stream live heart rate variability, sleep stages, and recovery indices.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => handleSyncWearable('Apple Health')}
                className="btn btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                }}
              >
                <span>Apple HealthKit</span>
                <span className="badge badge-success">
                  Connected <ArrowUpRight size={11} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSyncWearable('Oura Ring')}
                className="btn btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                }}
              >
                <span>Oura Ring Gen 3</span>
                <span className="badge badge-accent">
                  Sync Data <ArrowUpRight size={11} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
