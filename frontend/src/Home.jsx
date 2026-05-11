import { Link } from 'react-router-dom';
import { theme } from './styles';

const portals = [
  {
    title: 'Super Admin',
    description: 'Create and manage organizations across the platform',
    icon: '🔐',
    path: '/super-admin',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  {
    title: 'Admin Portal',
    description: 'Manage feature flags for your organization',
    icon: '⚙️',
    path: '/admin',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    title: 'User Portal',
    description: 'Check if a feature is enabled for your organization',
    icon: '👤',
    path: '/user',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
];

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: 24,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: theme.primary }}>⚡ Byepo</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 0' }}>Feature Flag Management</h1>
        <p style={{ color: '#6b7280', marginTop: 8, fontSize: 15 }}>
          Multi-tenant feature flag system — select your portal below
        </p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900 }}>
        {portals.map((p) => (
          <Link
            key={p.path}
            to={p.path}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              flex: '1 1 240px',
              maxWidth: 280,
              padding: 28,
              background: p.bg,
              border: `2px solid ${p.border}`,
              borderRadius: 12,
              display: 'block',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.5 }}>{p.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
