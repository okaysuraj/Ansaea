import { Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { useApiData } from '../../../hooks/useApiData';

export default function SlotManagement() {
  const { authenticatedFetch } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: schedules, loading, error, reload: fetchSlots } = useApiData('/doctors/slots', []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Available slots for the selected date
  const [drafts, setDrafts] = useState({});
  const currentSlots =
    drafts[selectedDate] ??
    schedules.find((schedule) => schedule.date === selectedDate)?.available_slots ??
    [];
  const setCurrentSlots = (slots) =>
    setDrafts((previous) => ({ ...previous, [selectedDate]: slots }));
  const standardSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const toggleSlot = (slot) => {
    if (currentSlots.includes(slot)) {
      setCurrentSlots(currentSlots.filter((s) => s !== slot));
    } else {
      setCurrentSlots([...currentSlots, slot]);
    }
  };

  const handleSaveSlots = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await authenticatedFetch('/doctors/slots', {
        method: 'POST',
        body: JSON.stringify({
          date: selectedDate,
          available_slots: currentSlots,
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `Slots saved for ${selectedDate}!` });
        fetchSlots();
      } else {
        setMessage({ type: 'error', text: 'Failed to update schedule slots.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error saving slots.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {error && <p role="alert">{error}</p>}
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
            Practice Operations
          </span>
          <h1>Availability & Slot Management</h1>
          <p style={{ marginTop: 'var(--space-1)' }}>
            Configure your clinical consultation calendar for patient bookings.
          </p>
        </div>
        <span className="badge badge-accent">{schedules.length} Scheduled Days</span>
      </div>

      {message && (
        <div
          className={`card card-padding ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`}
          style={{ color: 'var(--text-primary)' }}
        >
          {message.text}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {/* Date Selector & Slot Builder */}
        <div className="card card-padding">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Select Working Date</h3>
              <span className="text-caption">
                Choose calendar date to toggle hourly appointments
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              className="text-label"
              style={{ display: 'block', marginBottom: 'var(--space-1)' }}
            >
              Date
            </label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label
              className="text-label"
              style={{ display: 'block', marginBottom: 'var(--space-2)' }}
            >
              Consultation Time Slots
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--space-2)',
              }}
            >
              {standardSlots.map((slot) => {
                const isSelected = currentSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'center' }}
                  >
                    <Clock size={13} /> {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleSaveSlots}
            disabled={saving}
          >
            {saving ? 'Publishing...' : `Save ${currentSlots.length} Slots for ${selectedDate}`}
          </button>
        </div>

        {/* Existing Schedule Overview */}
        <div className="card card-padding">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
              <Clock size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Active Working Days</h3>
              <span className="text-caption">Configured schedule in PostgreSQL database</span>
            </div>
          </div>

          {loading ? (
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
              Loading schedule...
            </p>
          ) : schedules.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-6)',
                color: 'var(--text-secondary)',
              }}
            >
              <p>No schedules configured yet.</p>
              <span className="text-caption">
                Select a date on the left to add your first slots.
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {schedules.map((sch) => (
                <div
                  key={sch.id || sch.date}
                  style={{
                    padding: 'var(--space-3)',
                    background: sch.date === selectedDate ? 'var(--surface-2)' : 'var(--surface-0)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedDate(sch.date)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>{sch.date}</span>
                    <span className="badge badge-success">
                      {sch.available_slots?.length || 0} Slots Active
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {sch.available_slots?.map((s, i) => (
                      <span key={i} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
