import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { styles, theme } from '../../styles';

export default function SuperAdminDashboard() {
  const [orgs, setOrgs] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrgs = async () => {
    try {
      const { data } = await api.get('/super-admin/organizations');
      setOrgs(data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/super-admin');
    }
  };

  useEffect(() => { fetchOrgs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/super-admin/organizations', { name: orgName });
      setSuccess(`Organization "${orgName}" created successfully!`);
      setOrgName('');
      fetchOrgs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.nav}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          <span style={{ color: theme.primary }}>⚡</span> Super Admin Dashboard
        </div>
        <button onClick={handleLogout} style={{ ...styles.dangerButton }}>Logout</button>
      </div>

      <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 16px' }}>
        {/* Create Organization */}
        <div style={{ ...styles.card, marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Create Organization</h2>
          {error && <div style={{ ...styles.error, marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ ...styles.success, marginBottom: 12 }}>{success}</div>}
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 12 }}>
            <input
              style={{ ...styles.input }}
              type="text"
              placeholder="Organization name (e.g. Acme Corp)"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
            <button style={{ ...styles.button, whiteSpace: 'nowrap' }} type="submit" disabled={loading}>
              {loading ? 'Creating...' : '+ Create'}
            </button>
          </form>
        </div>

        {/* Organizations List */}
        <div style={styles.card}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>
            Organizations <span style={{ color: theme.muted, fontSize: 14, fontWeight: 400 }}>({orgs.length})</span>
          </h2>
          {orgs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
              No organizations yet. Create one above.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>#</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>ID</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org, i) => (
                  <tr key={org._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 12px', color: '#9ca3af', fontSize: 13 }}>{i + 1}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{org.name}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{org._id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#6b7280' }}>
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
