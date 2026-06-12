import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './components/LandingPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientMobileApp from './components/PatientMobileApp';
import ReceptionDashboard from './components/ReceptionDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient" element={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0F0F14' }}>
              <PatientMobileApp />
            </div>
          } />
          <Route path="/doctor" element={
            <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
              <DoctorDashboard />
            </div>
          } />
          <Route path="/reception" element={
            <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
              <ReceptionDashboard />
            </div>
          } />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
