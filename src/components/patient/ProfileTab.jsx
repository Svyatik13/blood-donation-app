import React from 'react';
import { User, LogOut, Globe, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProfileTab() {
  const { getActiveDonor, logoutDonor, t, lang, setLang, theme, toggleTheme } = useApp();
  const donor = getActiveDonor();

  if (!donor) return null;

  const toggleLang = () => {
    setLang(lang === 'cs' ? 'uk' : 'cs');
  };

  return (
    <div className="mob-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button 
          className="mob-btn-ghost" 
          onClick={toggleTheme} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button 
          className="mob-btn-ghost" 
          onClick={toggleLang} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Globe size={18} />
          <span style={{ fontWeight: 600 }}>{lang.toUpperCase()}</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="mob-profile-avatar">
          <User size={40} color="#fff" />
        </div>
        <h2 className="mob-profile-name">
          {donor.lastName} {donor.firstName} {donor.middleName}
        </h2>
        <div className="mob-profile-id">ID: {donor.id}</div>
      </div>

      <div className="mob-card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{t('step_personal')}</h3>

        <div className="mob-profile-row">
          <span className="mob-profile-label">Telefon:</span>
          <span className="mob-profile-value">{donor.phone}</span>
        </div>
        <div className="mob-profile-row">
          <span className="mob-profile-label">{t('email')}:</span>
          <span className="mob-profile-value">{donor.email || '—'}</span>
        </div>
        <div className="mob-profile-row">
          <span className="mob-profile-label">{t('dob')}:</span>
          <span className="mob-profile-value">{donor.dateOfBirth}</span>
        </div>
        <div className="mob-profile-row">
          <span className="mob-profile-label">{t('blood_group')}:</span>
          <span className="mob-profile-value" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            {donor.bloodType}
          </span>
        </div>
      </div>

      <button
        className="mob-btn mob-btn-outline"
        style={{ marginTop: '1.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
        onClick={logoutDonor}
      >
        <LogOut size={18} />
        Odhlásit se
      </button>
    </div>
  );
}
