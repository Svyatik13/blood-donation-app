import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, ClipboardList, MonitorPlay, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { docT } = useApp();

  const roles = [
    {
      key: 'donor',
      icon: <Droplets size={22} color="#DC2626" />,
      iconBg: '#FEF2F2',
      accent: '#DC2626',
      label: docT('landing_donor'),
      desc: docT('landing_donor_desc'),
      path: '/patient',
    },
    {
      key: 'reception',
      icon: <ClipboardList size={22} color="#2563EB" />,
      iconBg: '#EFF6FF',
      accent: '#2563EB',
      label: docT('landing_reception'),
      desc: docT('landing_reception_desc'),
      path: '/reception',
    },
    {
      key: 'doctor',
      icon: <Stethoscope size={22} color="#059669" />,
      iconBg: '#ECFDF5',
      accent: '#059669',
      label: docT('landing_doctor'),
      desc: docT('landing_doctor_desc'),
      path: '/doctor',
    },
    {
      key: 'board',
      icon: <MonitorPlay size={22} color="#7C3AED" />,
      iconBg: '#F5F3FF',
      accent: '#7C3AED',
      label: docT('board_title'),
      desc: docT('board_subtitle'),
      path: '/board',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAF8',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '2rem',
    }}>
      {/* Wordmark */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: 36,
            height: 36,
            background: '#DC2626',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Droplets size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
            Odběr krve
          </span>
        </div>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>
          {docT('landing_subtitle')}
        </p>
      </div>

      {/* Role cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: '900px',
      }}>
        {roles.map((role) => (
          <RoleCard key={role.key} role={role} onClick={() => navigate(role.path)} />
        ))}
      </div>

      <p style={{ marginTop: '3rem', color: '#9CA3AF', fontSize: '0.8rem' }}>
        Systém pro správu odběru krve
      </p>
    </div>
  );
}

function RoleCard({ role, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        background: '#FFFFFF',
        border: `1px solid ${hovered ? role.accent : '#E5E7EB'}`,
        borderLeft: `4px solid ${role.accent}`,
        borderRadius: 10,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
        boxShadow: hovered
          ? '0 4px 16px rgba(0,0,0,0.08)'
          : '0 1px 3px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        width: '100%',
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: role.iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {role.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111111', marginBottom: '0.2rem' }}>
          {role.label}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.4 }}>
          {role.desc}
        </div>
      </div>
    </button>
  );
}
