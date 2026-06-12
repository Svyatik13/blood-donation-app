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
  const { activeDonorId, theme, getActiveDonor, scanQrCode } = useApp();
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
                    {showQuestionnaire ? (
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
                {!showQuestionnaire && (
                  <MobileNavBar activeTab={activeTab} onTabChange={setActiveTab} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hardware Scanner Simulator */}
      {donor && donor.status === 'registered' && (
        <div style={{ marginLeft: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(52, 152, 219, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3498DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              <rect x="7" y="7" width="10" height="10" rx="1"></rect>
            </svg>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '200px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Сканнер Ресепшна</h3>
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>Симуляция физического прикладывания телефона к терминалу клиники.</p>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', background: '#3498DB' }}
              onClick={() => scanQrCode(donor.id)}
            >
              СИМУЛИРОВАТЬ
            </button>
          </div>
        </div>
      )}
      
      {donor && donor.status === 'scanned' && (
        <div style={{ marginLeft: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(5, 150, 105, 0.1)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '200px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#059669', marginBottom: '0.5rem' }}>Успешный скан!</h3>
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Пациент появился на Ресепшене. Теперь администратор должен проверить паспорт.</p>
          </div>
        </div>
      )}
    </div>
  );
}
