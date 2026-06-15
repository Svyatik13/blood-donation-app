import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import LoginScreen from './patient/LoginScreen';
import RegisterScreen from './patient/RegisterScreen';
import HomeTab from './patient/HomeTab';
import HistoryTab from './patient/HistoryTab';
import ProfileTab from './patient/ProfileTab';
import QuestionnaireScreen from './patient/QuestionnaireScreen';
import MobileNavBar from './patient/MobileNavBar';

export default function PatientMobileApp() {
  const { activeDonorId, theme, getActiveDonor, scanQrCode, docT, logoutDonor } = useApp();
  const [screen, setScreen] = useState(activeDonorId ? 'app' : 'login');
  const donor = getActiveDonor();
  const [activeTab, setActiveTab] = useState('home');
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  useEffect(() => {
    if (activeDonorId) {
      setScreen('app');
    } else {
      setScreen('login');
      setShowQuestionnaire(false);
      setActiveTab('home');
    }
  }, [activeDonorId]);

  return (
    <div className="patient-panel">
      <div className="device-frame" data-theme={theme}>
        <div className="device-notch" />
        <div className="device-status-bar">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div className="mob-app">
          <AnimatePresence mode="wait">
            {screen === 'login' && (
              <motion.div key="login" className="mob-scroll-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                <LoginScreen onSwitchToRegister={() => setScreen('register')} />
              </motion.div>
            )}
            {screen === 'register' && (
              <motion.div key="register" className="mob-scroll-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <RegisterScreen onSwitchToLogin={() => setScreen('login')} />
              </motion.div>
            )}
            {screen === 'app' && (
              <motion.div key="app" className="mob-scroll-wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="mob-scroll">
                  <AnimatePresence mode="wait">
                    {!donor ? (
                      <motion.div key="loading" className="mob-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem' }}>
                        <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Data nenalezena</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                          Pokud jste se právě zaregistrovali, pravděpodobně máte v konzoli Firebase zablokovaná práva pro čtení/zápis (Firestore Rules).
                        </p>
                        <button className="mob-btn mob-btn-outline" onClick={() => logoutDonor()}>
                          Odhlásit se a zkusit znovu
                        </button>
                      </motion.div>
                    ) : (showQuestionnaire || (donor?.status === 'checked-in' && !donor?.currentVisit?.questionnaireCompleted)) ? (
                      <motion.div key="questionnaire" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                        <QuestionnaireScreen onComplete={() => setShowQuestionnaire(false)} />
                      </motion.div>
                    ) : (
                      <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                        {activeTab === 'home' && <HomeTab onShowQuestionnaire={() => setShowQuestionnaire(true)} />}
                        {activeTab === 'history' && <HistoryTab />}
                        {activeTab === 'profile' && <ProfileTab />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {!(showQuestionnaire || (donor?.status === 'checked-in' && !donor?.currentVisit?.questionnaireCompleted)) && (
                  <MobileNavBar activeTab={activeTab} onTabChange={setActiveTab} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hardware Scanner Simulator */}
      {donor && donor.status === 'registered' && (
        <div style={{
          marginLeft: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: '#FFFFFF',
          padding: '1.75rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: '220px',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '10px',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              <rect x="7" y="7" width="10" height="10" rx="1"></rect>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111', marginBottom: '0.35rem' }}>{docT('scanner_title')}</h3>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '1.25rem', lineHeight: 1.45 }}>{docT('scanner_desc')}</p>
            <button
              className="btn btn-primary"
              style={{ width: '100%', background: '#2563EB', borderRadius: '8px' }}
              onClick={() => scanQrCode(donor.id)}
            >
              {docT('scanner_btn')}
            </button>
          </div>
        </div>
      )}
      
      {donor && donor.status === 'scanned' && (
        <div style={{
          marginLeft: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          background: '#FFFFFF',
          padding: '1.75rem',
          borderRadius: '12px',
          border: '1px solid #D1FAE5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: '220px',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '10px',
            background: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginBottom: '0.3rem' }}>{docT('scanner_success_title')}</h3>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.45 }}>{docT('scanner_success_desc')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
