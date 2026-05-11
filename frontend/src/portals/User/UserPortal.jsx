import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { styles, theme } from '../../styles';

export default function UserPortal() {
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ organizationId: '', key: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user/organizations')
      .then(({ data }) => setOrgs(data))
      .catch(() => setError('Failed to load organizations'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult(null);
    setError('');
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.get('/user/check', {
        params: { key: form.key, organizationId: form.organizationId },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Feature not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ ...styles.card, width: 460 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ position: 'absolute', left: -10, top: 0, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 14 }}
          >
            ← Home
          </button>
          <div style={{ fontSize: 32, fontWeight: 800, color: theme.primary }}>⚡ Byepo</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Feature Flag Checker</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Check if a feature is enabled for your organization</div>
        </div>

        <form onSubmit={handleCheck}>
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Select Organization</label>
            <select
              style={styles.input}
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

          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>Feature Key</label>
            <input
              style={styles.input}
              type="text"
              name="key"
              placeholder="e.g. dark_mode"
              value={form.key}
              onChange={handleChange}
              required
            />
          </div>

          <button style={{ ...styles.button, width: '100%' }} type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Check Feature'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 8,
            textAlign: 'center',
            background: result.enabled ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${result.enabled ? '#86efac' : '#fca5a5'}`,
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {result.enabled ? '✅' : '❌'}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: result.enabled ? '#16a34a' : '#dc2626' }}>
              {result.enabled ? 'ENABLED' : 'DISABLED'}
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: '#374151' }}>
              Feature <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: 4 }}>{result.key}</code>{' '}
              is <strong>{result.enabled ? 'enabled' : 'disabled'}</strong> for <strong>{result.organization}</strong>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ ...styles.error, marginTop: 16 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
