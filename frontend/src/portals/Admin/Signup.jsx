import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { styles, theme } from '../../styles';

export default function AdminSignup() {
  const [form, setForm] = useState({ email: '', password: '', organizationId: '' });
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user/organizations')
      .then(({ data }) => setOrgs(data))
      .catch(() => setError('Failed to load organizations'));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/admin/signup', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      if (!err.response) {
        setError('Network error. Please check your connection or ensure backend is running.');
      } else {
        setError(err.response.data?.message || 'Signup failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...styles.card, width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: theme.primary }}>⚡ Byepo</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Admin Portal – Sign Up</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Register as Organization Admin</div>
        </div>

        {error && <div style={{ ...styles.error, marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ ...styles.success, marginBottom: 16 }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Organization</label>
            <select
              style={{ ...styles.input }}
              name="organizationId"
              value={form.organizationId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select your organization --</option>
              {orgs.map((org) => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="admin@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...styles.input, paddingRight: 40 }}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button style={{ ...styles.button, width: '100%' }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/admin" style={{ color: theme.primary, fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
