import React from 'react';
import { Droplets, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginScreen({ onSwitchToRegister }) {
  const { loginDonor, testModeLogin, t, lang, setLang } = useApp();
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const donor = loginDonor(phone, password);
    if (!donor) {
      setError(t('login_error'));
    }
  };

  const toggleLang = () => {
    setLang(lang === 'cs' ? 'uk' : 'cs');
  };

  return (
    <div className="mob-scroll">
      <div className="mob-content animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem' }}>
          <button className="mob-btn-ghost" onClick={testModeLogin} style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--warning)', fontWeight: 600 }}>
            Test Mode
          </button>
          <button className="mob-btn-ghost" onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px' }}>
            <Globe size={18} />
            <span style={{ fontWeight: 600 }}>{lang.toUpperCase()}</span>
          </button>
        </div>

        <div className="mob-login-hero">
          <div className="mob-login-logo">
            <Droplets size={32} color="#fff" />
          </div>
          <h1 className="mob-login-title">{t('login_title')}</h1>
          <p className="mob-login-subtitle">{t('login_subtitle')}</p>
        </div>

        <form className="mob-card" onSubmit={handleLogin}>
          <div className="mob-input-group">
            <input
              type="tel"
              className="mob-input"
              placeholder={t('phone_placeholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mob-input-group">
            <input
              type="password"
              className="mob-input"
              placeholder={t('password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="mob-btn mob-btn-primary">
            {t('login_btn')}
          </button>
        </form>

        <button type="button" className="mob-btn mob-btn-ghost" onClick={onSwitchToRegister} style={{ marginTop: '0.5rem' }}>
          {t('register_title')}
        </button>
        <div style={{ height: '3rem', flexShrink: 0, width: '100%' }} />
      </div>
    </div>
  );
}
