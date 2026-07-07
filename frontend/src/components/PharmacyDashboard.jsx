import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pill, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

export default function PharmacyDashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([
    { id: 'ORD-1029', patient: 'John Doe', items: ['Lisinopril 10mg', 'Aspirin 81mg'], status: 'pending', total: '$15.00', date: 'Today, 9:00 AM' },
    { id: 'ORD-1030', patient: 'Jane Smith', items: ['Amoxicillin 500mg'], status: 'processing', total: '$8.50', date: 'Today, 10:15 AM' }
  ]);

  const handleProcess = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'processing' } : o));
  };

  const handleShip = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'shipped' } : o));
  };

  return (
    <div className="dashboard-container" style={{ padding: '2rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Pill size={28} className="text-primary" />
          <h1 style={{ margin: 0 }}>Pharmacy Module</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="auth-submit-btn" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-main" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingCart size={18} /> Active Orders</h3>
          <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem' }}>Order ID</th>
                <th>Patient</th>
                <th>Items</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>{order.id}</td>
                  <td>{order.patient}</td>
                  <td style={{ fontSize: '0.85rem' }}>{order.items.join(', ')}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      backgroundColor: order.status === 'pending' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: order.status === 'pending' ? 'var(--color-danger)' : 'var(--color-warning)'
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {order.status === 'pending' && (
                      <button className="btn-secondary" onClick={() => handleProcess(order.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Process</button>
                    )}
                    {order.status === 'processing' && (
                      <button className="btn-submit" onClick={() => handleShip(order.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}><Truck size={12}/> Ship</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} /> Inventory Alerts</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderLeft: '3px solid var(--color-danger)', borderRadius: '4px' }}>
              <strong>Low Stock:</strong> Metformin 500mg (Only 2 boxes left)
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(234, 179, 8, 0.05)', borderLeft: '3px solid var(--color-warning)', borderRadius: '4px' }}>
              <strong>Expiring Soon:</strong> Ibuprofen 400mg (Batch #1092 expires next month)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
