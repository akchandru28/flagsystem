import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { styles, theme } from '../../styles';

export default function AdminDashboard() {
  const [flags, setFlags] = useState([]);
  const [form, setForm] = useState({ key: '', description: '', enabled: false });
  const [editForm, setEditForm] = useState({ id: null, key: '', description: '', enabled: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('email');

  const fetchFlags = async () => {
    try {
      const { data } = await api.get('/admin/flags');
      setFlags(data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    }
  };

  useEffect(() => { fetchFlags(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/admin/flags', form);
      setSuccess(`Flag "${form.key}" created!`);
      setForm({ key: '', description: '', enabled: false });
      fetchFlags();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create flag');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (flag) => {
    try {
      await api.put(`/admin/flags/${flag._id}`, { enabled: !flag.enabled });
      fetchFlags();
    } catch (err) {
      alert('Failed to update flag');
    }
  };

  const handleEdit = (flag) => {
    setEditForm({ id: flag._id, key: flag.key, description: flag.description, enabled: flag.enabled });
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/admin/flags/${editForm.id}`, { 
        key: editForm.key, 
        description: editForm.description, 
        enabled: editForm.enabled 
      });
      setEditForm({ id: null, key: '', description: '', enabled: false });
      fetchFlags();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update flag');
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ id: null, key: '', description: '', enabled: false });
  };

  const handleDelete = async (id, key) => {
    if (!window.confirm(`Delete flag "${key}"?`)) return;
    try {
      await api.delete(`/admin/flags/${id}`);
      fetchFlags();
    } catch (err) {
      alert('Failed to delete flag');
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
          <span style={{ color: theme.primary }}>⚡</span> Admin Dashboard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{email}</span>
          <button onClick={handleLogout} style={styles.dangerButton}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '32px auto', padding: '0 16px' }}>
        {/* Create Flag */}
        <div style={{ ...styles.card, marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Create Feature Flag</h2>
          {error && <div style={{ ...styles.error, marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ ...styles.success, marginBottom: 12 }}>{success}</div>}

          <form onSubmit={handleCreate}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={styles.label}>Feature Key *</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. dark_mode"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  required
                />
              </div>
              <div style={{ flex: '2 1 240px' }}>
                <label style={styles.label}>Description</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="What does this flag control?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  Enabled
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button style={styles.button} type="submit" disabled={loading}>
                  {loading ? 'Creating...' : '+ Add Flag'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Flags List */}
        <div style={styles.card}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>
            Feature Flags <span style={{ color: '#9ca3af', fontSize: 14, fontWeight: 400 }}>({flags.length})</span>
          </h2>

          {flags.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
              No feature flags yet. Create one above.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Key', 'Description', 'Status', 'Created', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flags.map((flag) => (
                  <tr key={flag._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {editForm.id === flag._id ? (
                      <>
                        <td style={{ padding: '10px 12px' }}>
                          <input 
                            style={{ ...styles.input, padding: '4px 8px', fontSize: 13 }} 
                            value={editForm.key} 
                            onChange={(e) => setEditForm({...editForm, key: e.target.value})} 
                          />
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <input 
                            style={{ ...styles.input, padding: '4px 8px', fontSize: 13 }} 
                            value={editForm.description} 
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})} 
                          />
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <input 
                            type="checkbox" 
                            checked={editForm.enabled} 
                            onChange={(e) => setEditForm({...editForm, enabled: e.target.checked})} 
                          />
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#9ca3af' }}>
                          —
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={handleSaveEdit} style={{ ...styles.button, padding: '5px 12px', fontSize: 12 }}>Save</button>
                            <button onClick={handleCancelEdit} style={{ padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, fontSize: 14 }}>
                          {flag.key}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: '#6b7280' }}>
                          {flag.description || '—'}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background: flag.enabled ? '#dcfce7' : '#f3f4f6',
                            color: flag.enabled ? '#16a34a' : '#6b7280',
                          }}>
                            {flag.enabled ? '● Enabled' : '○ Disabled'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#9ca3af' }}>
                          {new Date(flag.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleToggle(flag)}
                              style={{
                                padding: '5px 12px',
                                background: flag.enabled ? '#fef3c7' : '#dcfce7',
                                color: flag.enabled ? '#d97706' : '#16a34a',
                                border: 'none',
                                borderRadius: 5,
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              {flag.enabled ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              onClick={() => handleEdit(flag)}
                              style={{
                                padding: '5px 12px',
                                background: '#e0f2fe',
                                color: '#0369a1',
                                border: 'none',
                                borderRadius: 5,
                                cursor: 'pointer',
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(flag._id, flag.key)}
                              style={{ ...styles.dangerButton, padding: '5px 12px', fontSize: 12 }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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
