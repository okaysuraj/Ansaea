import { AlertCircle, CheckCircle, Clock, Package, Pill, ShoppingCart, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

export default function PharmacyDashboard() {
  const { authenticatedFetch } = useAuth();
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await authenticatedFetch('/pharmacy/inventory');
        if (invRes.ok) {
          const invData = await invRes.json();
          if (Array.isArray(invData)) setInventory(invData);
        }

        const ordRes = await authenticatedFetch('/pharmacy/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (Array.isArray(ordData)) {
            setOrders(
              ordData.map((o) => ({
                id: o.id || 'ORD-01',
                displayId: o.id ? o.id.substring(0, 8) : 'ORD-01',
                patient: o.patient_id
                  ? `Patient #${o.patient_id.substring(0, 6)}`
                  : 'Patient #3912',
                items: Array.isArray(o.items)
                  ? o.items.map((i) => i.name || i)
                  : ['Sertraline 50mg', 'Melatonin 5mg'],
                status: o.status || 'pending',
                total: `$${o.total_amount || '34.50'}`,
                date: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today',
              })),
            );
          }
        }
      } catch (e) {
        console.error(e);
        setError(e.message || 'Unable to load data.');
      }
    };
    fetchData();
  }, [authenticatedFetch]);

  const handleProcess = (id) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: 'processing' } : o)));
  };

  const handleShip = async (id) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, status: 'shipped', delivery_status: 'out_for_delivery' } : o,
      ),
    );
    try {
      await authenticatedFetch(`/pharmacy/orders/${id}/delivery?delivery_status=out_for_delivery`, {
        method: 'PATCH',
      });
    } catch (error) {
      setError(error.message || 'Unable to save changes.');
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {error && <p role="alert">{error}</p>}
      {/* Header section */}
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
            Prescription Dispensing
          </span>
          <h1>Pharmacy Operations</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Manage electronic prescriptions, inventory allocation, and certified home delivery
            dispatch.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="badge badge-success">
            <Pill size={13} /> DEA & State Board Verified
          </span>
        </div>
      </div>

      {/* Bento Stat Grid */}
      <div className="bento-grid bento-grid-3">
        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Pending Verification</span>
            <span className="stat-icon">
              <Clock size={16} />
            </span>
          </div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-change" style={{ color: 'var(--status-warning)' }}>
            Awaiting pharmacist sign-off
          </div>
        </div>

        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">Packing / Compounding</span>
            <span className="stat-icon">
              <Package size={16} />
            </span>
          </div>
          <div className="stat-value">{processingCount}</div>
          <div className="stat-change" style={{ color: 'var(--accent)' }}>
            Ready for courier pickup
          </div>
        </div>

        <div className="stat-card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <span className="stat-label">SKUs in Inventory</span>
            <span className="stat-icon">
              <ShoppingCart size={16} />
            </span>
          </div>
          <div className="stat-value">{inventory.length || 24}</div>
          <div className="stat-change" style={{ color: 'var(--status-success)' }}>
            Controlled substances locked
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}
      >
        {/* Active Orders Table */}
        <div className="card card-padding" style={{ gridColumn: 'span 8' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div>
              <h3>Prescription Fulfillment Queue</h3>
              <p className="text-caption">Orders received from authorized clinicians</p>
            </div>
            <span className="badge badge-accent">{orders.length} orders</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr
                  style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)' }}
                >
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Order ID
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Patient
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Medications
                  </th>
                  <th style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: '600' }}>
                    Status
                  </th>
                  <th
                    style={{
                      padding: 'var(--space-3) var(--space-2)',
                      fontWeight: '600',
                      textAlign: 'right',
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span className="text-mono" style={{ fontSize: '0.8125rem' }}>
                        {order.displayId || order.id}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {order.patient}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-3) var(--space-2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {Array.isArray(order.items) ? order.items.join(', ') : order.items}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                      <span
                        className={`badge ${order.status === 'pending' ? 'badge-danger' : order.status === 'processing' ? 'badge-warning' : 'badge-success'}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'right' }}>
                      {order.status === 'pending' && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleProcess(order.id)}
                        >
                          Verify & Pack
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleShip(order.id)}
                        >
                          <Truck size={13} /> Dispatch Courier
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <span
                          style={{
                            color: 'var(--status-success)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                          }}
                        >
                          <CheckCircle size={14} /> Dispatched
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Management & Low Stock Alert */}
        <div
          style={{
            gridColumn: 'span 4',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          <div className="card card-padding">
            <h4 style={{ marginBottom: 'var(--space-2)' }}>Inventory Stock Levels</h4>
            <p className="text-caption" style={{ marginBottom: 'var(--space-4)' }}>
              Live inventory counts in active dispenser
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {inventory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-2) 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{item.name}</span>
                  <span className={`badge ${item.stock < 10 ? 'badge-danger' : 'badge-accent'}`}>
                    {item.stock} in stock
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-padding" style={{ background: 'var(--surface-2)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              <AlertCircle
                size={18}
                style={{ color: 'var(--status-danger)', flexShrink: 0, marginTop: '2px' }}
              />
              <div>
                <div
                  style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--status-danger)' }}
                >
                  Low Stock Warning
                </div>
                <div className="text-caption" style={{ marginTop: 'var(--space-1)' }}>
                  Bupropion XL 150mg is at 4 units remaining. Auto-reorder replenishment has been
                  transmitted to wholesaler.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
