import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n';

const AppContext = createContext(null);

const STORAGE_KEY = 'bloodlife_data';

// Generate unique ID
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Format time elapsed
export const formatElapsed = (startTime) => {
  if (!startTime) return '—';
  const diff = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Default data
const INITIAL_DONORS = [
  {
    id: 'demo-001',
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Петрович',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    bloodType: 'A+',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@email.com',
    passportNumber: '4510 123456',
    address: 'г. Москва, ул. Ленина, д. 10',
    weight: 82,
    chronicDiseases: 'Нет',
    allergies: 'Нет',
    medications: 'Нет',
    password: '1234',
    registeredAt: Date.now() - 86400000 * 30,
    totalDonations: 5,
    lastDonationDate: '2026-04-01',
    status: 'registered',
    currentVisit: null,
    donationHistory: [
      { date: '2026-04-01', bloodVolume: 450, location: 'Кабинет А', doctor: 'Др. Смирнова', bloodType: 'A+', notes: '' },
      { date: '2025-12-10', bloodVolume: 450, location: 'Кабинет Б', doctor: 'Др. Козлов', bloodType: 'A+', notes: '' }
    ]
  }
];

// Blood type colors for avatars
export const bloodTypeColors = {
  'A+': '#E74C3C', 'A-': '#C0392B',
  'B+': '#3498DB', 'B-': '#2980B9',
  'AB+': '#9B59B6', 'AB-': '#8E44AD',
  'O+': '#E67E22', 'O-': '#D35400',
};

// Room options
export const ROOMS = ['Místnost A', 'Místnost B', 'Místnost C'];
export const DOCTORS = ['MUDr. Nováková', 'MUDr. Svoboda', 'MUDr. Dvořák'];

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return { donors: parsed, queueCounter: 1, lastQueueDate: new Date().toISOString().slice(0, 10) };
        }
        return parsed;
      }
    } catch (e) { /* ignore */ }
    return { donors: INITIAL_DONORS, queueCounter: 1, lastQueueDate: new Date().toISOString().slice(0, 10), theme: 'dark' };
  });

  const donors = state.donors || INITIAL_DONORS;
  const theme = state.theme || 'dark';

  // Auto-recover if HMR preserved an old array state
  useEffect(() => {
    if (Array.isArray(state)) {
      setState(prev => ({
        donors: Array.isArray(prev) ? prev : (prev.donors || INITIAL_DONORS),
        queueCounter: 1,
        lastQueueDate: new Date().toISOString().slice(0, 10)
      }));
    }
  }, [state]);

  // Check if we need to reset queue counter for a new day
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastQueueDate !== today) {
      setState(prev => ({ ...prev, queueCounter: 1, lastQueueDate: today }));
    }
  }, [state.lastQueueDate]);

  // Active patient on the mobile simulator
  const [activeDonorId, setActiveDonorId] = useState(null);

  // Language state
  const [lang, setLang] = useState(() => localStorage.getItem('bloodlife_lang') || 'cs');
  
  useEffect(() => {
    localStorage.setItem('bloodlife_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const t = useCallback((key, params = {}) => {
    let str = translations[lang]?.[key] || translations['cs']?.[key] || key;
    if (typeof str === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v);
      });
    }
    return str;
  }, [lang]);

  const docT = useCallback((key) => {
    return translations['cs']?.[key] || key;
  }, []);

  // Notification state (for doctor panel)
  const [notifications, setNotifications] = useState([]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Sync state across different tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ---- Helpers ----
  const getActiveDonor = useCallback(() => {
    if (!activeDonorId) return null;
    return donors.find(d => d.id === activeDonorId) || null;
  }, [activeDonorId, donors]);

  const getDonorById = useCallback((id) => {
    return donors.find(d => d.id === id) || null;
  }, [donors]);

  const updateDonor = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const n = { id: uid(), message, type, time: Date.now() };
    setNotifications(prev => [n, ...prev].slice(0, 20));
  }, []);

  // ---- Patient Actions ----
  const registerDonor = useCallback((data) => {
    const newDonor = {
      id: uid(),
      ...data,
      registeredAt: Date.now(),
      totalDonations: 0,
      lastDonationDate: null,
      status: 'registered',
      currentVisit: null,
      donationHistory: []
    };
    setState(prev => {
      const currentDonors = Array.isArray(prev) ? prev : (prev.donors || []);
      const restState = Array.isArray(prev) 
        ? { queueCounter: 1, lastQueueDate: new Date().toISOString().slice(0, 10), theme: 'dark' } 
        : prev;
      return { ...restState, donors: [...currentDonors, newDonor] };
    });
    setActiveDonorId(newDonor.id);
    addNotification(`Новый донор зарегистрирован: ${data.lastName} ${data.firstName}`, 'info');
    return newDonor;
  }, [addNotification]);

  const loginDonor = useCallback((phone, password) => {
    const donor = donors.find(d => d.phone === phone && d.password === password);
    if (donor) {
      setActiveDonorId(donor.id);
      return donor;
    }
    return null;
  }, [donors]);

  const testModeLogin = useCallback(() => {
    const testDonor = {
      id: uid(),
      firstName: 'Test',
      lastName: 'User',
      middleName: '',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      phone: '+420 000 000 000',
      email: 'test@example.com',
      passportNumber: 'TEST123456',
      address: 'Testovací 1, Praha',
      password: 'test',
      bloodType: 'O+',
      weight: 80,
      chronicDiseases: '',
      allergies: '',
      medications: '',
      registeredAt: Date.now(),
      totalDonations: 0,
      lastDonationDate: null,
      status: 'registered',
      currentVisit: null,
      donationHistory: [],
      isTestMode: true // Special flag
    };
    
    setState(prev => {
      const currentDonors = Array.isArray(prev) ? prev : (prev.donors || []);
      const restState = Array.isArray(prev) 
        ? { queueCounter: 1, lastQueueDate: new Date().toISOString().slice(0, 10), theme: 'dark' } 
        : prev;
      return { ...restState, donors: [...currentDonors, testDonor] };
    });
    setActiveDonorId(testDonor.id);
    addNotification(`Test mode started!`, 'warning');
    return testDonor;
  }, [addNotification]);

  const logoutDonor = useCallback(() => {
    setActiveDonorId(null);
  }, []);

  const scanQrCode = useCallback((donorId) => {
    setState(prev => {
      const newDonors = prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return { ...d, status: 'scanned' };
      });
      return { ...prev, donors: newDonors };
    });
    addNotification('QR kód naskenován. Čeká se na ověření totožnosti.', 'success');
  }, [addNotification]);

  const checkIn = useCallback((donorId) => {
    const today = new Date().toISOString().slice(0, 10);
    setState(prev => {
      // Reset counter if new day
      const isNewDay = prev.lastQueueDate !== today;
      const nextQ = isNewDay ? 1 : prev.queueCounter;
      
      const newDonors = prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'checked-in',
          currentVisit: {
            queueNumber: nextQ,
            checkedInAt: Date.now(),
            questionnaireCompleted: false,
            systolic: null,
            diastolic: null,
            bloodSampleTakenAt: null,
            resultsReadyAt: null,
            rejectionReason: null,
            assignedRoom: null,
            assignedDoctor: null,
            donationStartedAt: null,
            bloodVolume: null,
            notes: ''
          }
        };
      });

      return {
        ...prev,
        donors: newDonors,
        queueCounter: nextQ + 1,
        lastQueueDate: today
      };
    });
    
    const donor = getDonorById(donorId);
    if (donor) {
      addNotification(`${donor.lastName} ${donor.firstName} получил номерок`, 'warning');
    }
  }, [getDonorById, addNotification]);

  const submitQuestionnaire = useCallback((donorId, answers = {}) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'questionnaire',
          currentVisit: { 
            ...d.currentVisit, 
            questionnaireCompleted: true,
            questionnaireAnswers: answers
          }
        };
      })
    }));
    const donor = getDonorById(donorId);
    if (donor) {
      addNotification(`Анкета заполнена (Номерок #${donor.currentVisit?.queueNumber})`, 'info');
    }
  }, [getDonorById, addNotification]);

  // ---- Doctor Actions ----
  const acceptDocuments = useCallback((donorId) => {
    updateDonor(donorId, { status: 'documents' });
    addNotification(`Документы приняты`, 'info');
  }, [updateDonor, addNotification]);

  const startPressure = useCallback((donorId) => {
    updateDonor(donorId, { status: 'pressure' });
  }, [updateDonor]);

  const approvePressure = useCallback((donorId, sys, dia) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'blood-sample',
          currentVisit: { ...d.currentVisit, systolic: sys, diastolic: dia }
        };
      })
    }));
    addNotification(`Давление в норме, переход к анализу`, 'success');
  }, [addNotification]);

  const rejectDonor = useCallback((donorId, reason) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'rejected',
          currentVisit: { ...d.currentVisit, rejectionReason: reason }
        };
      })
    }));
    addNotification(`Отказ: ${reason}`, 'error');
  }, [addNotification]);

  const acknowledgeRejection = useCallback((donorId) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'registered',
          currentVisit: null // Clear visit
        };
      })
    }));
  }, []);

  const takeBloodSample = useCallback((donorId) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'awaiting-results',
          currentVisit: { ...d.currentVisit, bloodSampleTakenAt: Date.now() }
        };
      })
    }));
    addNotification(`Образец взят, ожидание результатов`, 'info');
  }, [addNotification]);

  const resultsReady = useCallback((donorId) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'doctor-review',
          currentVisit: { ...d.currentVisit, resultsReadyAt: Date.now() }
        };
      })
    }));
    addNotification(`Результаты анализа готовы`, 'warning');
  }, [addNotification]);

  const doctorApprove = useCallback((donorId, room, doctor) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        return {
          ...d,
          status: 'donating',
          currentVisit: {
            ...d.currentVisit,
            assignedRoom: room,
            assignedDoctor: doctor,
            donationStartedAt: Date.now()
          }
        };
      })
    }));
    addNotification(`Допущен. Направлен в ${room}`, 'success');
  }, [addNotification]);

  const completeDonation = useCallback((donorId, bloodVolume, notes) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId) return d;
        const visit = d.currentVisit;
        const historyEntry = {
          date: new Date().toISOString().slice(0, 10),
          bloodVolume: bloodVolume || 450,
          location: visit?.assignedRoom || 'N/A',
          doctor: visit?.assignedDoctor || 'N/A',
          bloodType: d.bloodType,
          notes: notes || visit?.notes || ''
        };
        return {
          ...d,
          status: 'completed',
          totalDonations: d.totalDonations + 1,
          lastDonationDate: historyEntry.date,
          currentVisit: null,
          donationHistory: [historyEntry, ...d.donationHistory]
        };
      })
    }));
    addNotification(`Сдача крови завершена!`, 'success');
  }, [addNotification]);

  const addDoctorNote = useCallback((donorId, note) => {
    setState(prev => ({
      ...prev,
      donors: prev.donors.map(d => {
        if (d.id !== donorId || !d.currentVisit) return d;
        return {
          ...d,
          currentVisit: { ...d.currentVisit, notes: note }
        };
      })
    }));
  }, []);

  const searchDonors = useCallback((query) => {
    if (!query || !query.trim()) return donors;
    const q = query.toLowerCase().trim();
    return donors.filter(d =>
      d.firstName.toLowerCase().includes(q) ||
      d.lastName.toLowerCase().includes(q) ||
      d.middleName?.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.id.includes(q) ||
      d.bloodType.toLowerCase().includes(q)
    );
  }, [donors]);

  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayDonors = donors.filter(d =>
      d.status !== 'registered' ||
      d.donationHistory.some(h => h.date === today)
    );
    const inQueue = donors.filter(d => 
      ['checked-in', 'questionnaire', 'documents', 'pressure', 'blood-sample', 'awaiting-results', 'doctor-review'].includes(d.status)
    ).length;
    const activeDonations = donors.filter(d => d.status === 'donating').length;
    const rejected = donors.filter(d => d.status === 'rejected' && d.currentVisit?.checkedInAt && new Date(d.currentVisit.checkedInAt).toISOString().slice(0,10) === today).length;
    const completedToday = donors.filter(d => d.status === 'completed' || d.donationHistory.some(h => h.date === today)).length;
    const totalBlood = donors.reduce((acc, d) => {
      const todayH = d.donationHistory.find(h => h.date === today);
      return acc + (todayH ? todayH.bloodVolume : 0);
    }, 0);

    return { todayDonors: todayDonors.length, inQueue, activeDonations, rejected, completedToday, totalBlood };
  }, [donors]);

  // Reset data
  const resetData = useCallback(() => {
    setState({ donors: INITIAL_DONORS, queueCounter: 1, lastQueueDate: new Date().toISOString().slice(0, 10), theme: 'dark' });
    setActiveDonorId(null);
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    donors,
    activeDonorId,
    notifications,
    getActiveDonor,
    getDonorById,
    registerDonor,
    loginDonor,
    testModeLogin,
    logoutDonor,
    scanQrCode,
    checkIn,
    submitQuestionnaire,
    acceptDocuments,
    startPressure,
    approvePressure,
    rejectDonor,
    acknowledgeRejection,
    takeBloodSample,
    resultsReady,
    doctorApprove,
    completeDonation,
    addDoctorNote,
    searchDonors,
    getTodayStats,
    resetData,
    lang,
    setLang,
    t,
    docT,
    theme,
    toggleTheme,
    ROOMS,
    DOCTORS
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
