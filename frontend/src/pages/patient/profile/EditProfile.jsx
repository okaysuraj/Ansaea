import { ArrowLeft, Calendar, Mail, Phone, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, authenticatedFetch } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: user?.email || '',
    phone_number: '',
    dob: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authenticatedFetch('/patients/profile');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            full_name: data.full_name || user?.username || '',
            email: user?.email || '',
            phone_number: data.phone_number || '',
            dob: data.dob || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authenticatedFetch, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await authenticatedFetch('/patients/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: formData.full_name,
          dob: formData.dob,
          phone_number: formData.phone_number,
        }),
      });
      if (res.ok) {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully in electronic health database!',
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error updating profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '640px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/patient/profile')}
        >
          <ArrowLeft size={14} /> Back to Profile
        </button>
        <div>
          <h1 style={{ margin: 0 }}>Edit Patient Profile</h1>
          <span className="text-caption">Update your personal and contact details</span>
        </div>
      </div>

      {message && (
        <div
          className={`card card-padding ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`}
          style={{ color: 'var(--text-primary)' }}
        >
          {message.text}
        </div>
      )}

      <div className="card card-padding">
        {loading ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            Loading patient profile...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
          >
            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Full Legal Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="text"
                  name="full_name"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Johnathan Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Registered Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  style={{
                    paddingLeft: '2.5rem',
                    background: 'var(--surface-2)',
                    cursor: 'not-allowed',
                  }}
                  value={formData.email}
                  disabled
                />
              </div>
              <span className="text-caption" style={{ marginTop: '2px', display: 'block' }}>
                Email is synchronized with your Firebase Auth credentials.
              </span>
            </div>

            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="tel"
                  name="phone_number"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label
                className="text-label"
                style={{ display: 'block', marginBottom: 'var(--space-1)' }}
              >
                Date of Birth
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="date"
                  name="dob"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--space-3)',
                marginTop: 'var(--space-2)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/patient/profile')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={15} /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
