import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n';
import { storage } from '../platform/storage';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot
} from 'firebase/firestore';

const AppContext = createContext(null);

export const formatElapsed = (startTime) => {
  if (!startTime) return '—';
  const diff = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const bloodTypeColors = {
  'A+': '#E74C3C', 'A-': '#C0392B',
  'B+': '#3498DB', 'B-': '#2980B9',
  'AB+': '#9B59B6', 'AB-': '#8E44AD',
  'O+': '#E67E22', 'O-': '#D35400',
};

export const ROOMS = ['Místnost A', 'Místnost B', 'Místnost C'];
export const DOCTORS = ['MUDr. Nováková', 'MUDr. Svoboda', 'MUDr. Dvořák'];

export function AppProvider({ children }) {
  const [donors, setDonors] = useState([]);
  const [activeDonorId, setActiveDonorId] = useState(null);
  const [lang, setLang] = useState(() => storage.getString('bloodlife_lang') || 'cs');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [queueCounter, setQueueCounter] = useState(1);
  const [lastQueueDate, setLastQueueDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    storage.setString('bloodlife_lang', lang);
  }, [lang]);

  // Real-time Firestore sync for donors
  useEffect(() => {
    const q = collection(db, 'donors');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donorsData = [];
      snapshot.forEach(d => donorsData.push({ id: d.id, ...d.data() }));
      setDonors(donorsData);
    }, (err) => console.error("Firestore sync error:", err));
    return () => unsubscribe();
  }, []);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setActiveDonorId(user.uid);
      } else {
        setActiveDonorId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Manage queue locally based on date
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastQueueDate !== today) {
      setQueueCounter(1);
      setLastQueueDate(today);
    }
  }, [lastQueueDate]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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

  const getActiveDonor = useCallback(() => {
    if (!activeDonorId) return null;
    return donors.find(d => d.id === activeDonorId) || null;
  }, [activeDonorId, donors]);

  const getDonorById = useCallback((id) => {
    return donors.find(d => d.id === id) || null;
  }, [donors]);

  const updateDonor = useCallback(async (id, updates) => {
    try {
      const docRef = doc(db, 'donors', id);
      await updateDoc(docRef, updates);
    } catch (e) {
      console.error("Error updating donor", e);
    }
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const n = { id: Date.now().toString(), message, type, time: Date.now() };
    setNotifications(prev => [n, ...prev].slice(0, 20));
  }, []);

  const registerDonor = useCallback(async (data) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCred.user;
      const newDonor = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        middleName: data.middleName || '',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'male',
        phone: data.phone || '',
        email: data.email || '',
        passportNumber: data.passportNumber || '',
        bloodType: data.bloodType || 'A+',
        weight: Number(data.weight) || 0,
        chronicDiseases: data.chronicDiseases || '',
        allergies: data.allergies || '',
        medications: data.medications || '',
        registeredAt: Date.now(),
        totalDonations: 0,
        lastDonationDate: null,
        status: 'registered',
        currentVisit: null,
        donationHistory: []
      };
      await setDoc(doc(db, 'donors', user.uid), newDonor);
      addNotification(`Nový dárce zaregistrován: ${data.lastName}`, 'info');
      return { id: user.uid, ...newDonor };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [addNotification]);

  const loginDonor = useCallback(async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      return userCred.user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const logoutDonor = useCallback(async () => {
    await signOut(auth);
  }, []);

  const testModeLogin = useCallback(async () => {
    alert("Test mode login disabled in Firebase mode. Please register a real test account.");
  }, []);

  const checkIn = useCallback(async (donorId) => {
    const today = new Date().toISOString().slice(0, 10);
    let nextQ = queueCounter;
    if (lastQueueDate !== today) {
      nextQ = 1;
      setLastQueueDate(today);
    }
    
    await updateDonor(donorId, {
      status: 'checked-in',
      currentVisit: {
        queueNumber: nextQ,
        checkedInAt: Date.now(),
        questionnaireCompleted: false,
        systolic: null,
        diastolic: null,
        heartRate: null,
        temperature: null,
        hemoglobin: null,
        bloodSampleTakenAt: null,
        resultsReadyAt: null,
        rejectionReason: null,
        assignedRoom: null,
        assignedDoctor: null,
        donationStartedAt: null,
        bloodVolume: null,
        notes: ''
      }
    });
    setQueueCounter(nextQ + 1);
    
    const donor = getDonorById(donorId);
    if (donor) {
      addNotification(`${donor.lastName} obdržel číslo`, 'warning');
    }
  }, [queueCounter, lastQueueDate, updateDonor, getDonorById, addNotification]);

  const scanQrCode = useCallback((donorId) => {
    checkIn(donorId);
    addNotification('QR kód naskenován. Číslo ve frontě přiděleno.', 'success');
  }, [checkIn, addNotification]);

  const submitQuestionnaire = useCallback(async (donorId, answers = {}) => {
    const donor = getDonorById(donorId);
    if (!donor) return;
    await updateDonor(donorId, {
      status: 'questionnaire',
      currentVisit: {
        ...donor.currentVisit,
        questionnaireCompleted: true,
        questionnaireAnswers: answers
      }
    });
    addNotification(`Dotazník vyplněn (Číslo #${donor.currentVisit?.queueNumber})`, 'info');
  }, [getDonorById, updateDonor, addNotification]);

  const approveQuestionnaire = useCallback((donorId) => {
    updateDonor(donorId, { status: 'documents' });
    addNotification(`Dotazník schválen. Čeká se na doklady.`, 'success');
  }, [updateDonor, addNotification]);

  const acceptDocuments = useCallback((donorId) => {
    updateDonor(donorId, { status: 'pressure' });
    addNotification(`Doklady přijaty. Přechod k vyšetření.`, 'info');
  }, [updateDonor, addNotification]);

  const startPressure = useCallback((donorId) => {
    updateDonor(donorId, { status: 'pressure' });
  }, [updateDonor]);

  const approveVitals = useCallback((donorId, sys, dia, pulse, temp, hemo) => {
    const donor = getDonorById(donorId);
    if(!donor) return;
    updateDonor(donorId, {
      status: 'blood-sample',
      currentVisit: { 
        ...donor.currentVisit,
        systolic: sys, 
        diastolic: dia,
        heartRate: pulse,
        temperature: temp,
        hemoglobin: hemo
      }
    });
    addNotification(`Vyšetření tlaku a vitálních funkcí dokončeno`, 'success');
  }, [getDonorById, updateDonor, addNotification]);

  const rejectDonor = useCallback((donorId, reason) => {
    const donor = getDonorById(donorId);
    if(!donor) return;
    updateDonor(donorId, {
      status: 'rejected',
      currentVisit: { ...donor.currentVisit, rejectionReason: reason }
    });
    addNotification(`Odmítnutí: ${reason}`, 'error');
  }, [getDonorById, updateDonor, addNotification]);

  const acknowledgeRejection = useCallback((donorId) => {
    updateDonor(donorId, { status: 'registered', currentVisit: null });
  }, [updateDonor]);

  const takeBloodSample = useCallback((donorId) => {
    const donor = getDonorById(donorId);
    if(!donor) return;
    updateDonor(donorId, {
      status: 'awaiting-results',
      currentVisit: { ...donor.currentVisit, bloodSampleTakenAt: Date.now() }
    });
    addNotification(`Vzorek odebrán, čeká se na výsledky`, 'info');
  }, [getDonorById, updateDonor, addNotification]);

  const resultsReady = useCallback((donorId) => {
    const donor = getDonorById(donorId);
    if(!donor) return;
    updateDonor(donorId, {
      status: 'doctor-review',
      currentVisit: { ...donor.currentVisit, resultsReadyAt: Date.now() }
    });
    addNotification(`Výsledky analýzy jsou hotové`, 'warning');
  }, [getDonorById, updateDonor, addNotification]);

  const doctorApprove = useCallback((donorId, room, doctor) => {
    const donor = getDonorById(donorId);
    if(!donor) return;
    updateDonor(donorId, {
      status: 'donating',
      currentVisit: {
        ...donor.currentVisit,
        assignedRoom: room,
        assignedDoctor: doctor,
        donationStartedAt: Date.now()
      }
    });
    addNotification(`Schválen. Směřován do ${room}`, 'success');
  }, [getDonorById, updateDonor, addNotification]);

  const completeDonation = useCallback((donorId, bloodVolume, notes) => {
    const donor = getDonorById(donorId);
    if(!donor) return;
    const visit = donor.currentVisit;
    const historyEntry = {
      date: new Date().toISOString().slice(0, 10),
      bloodVolume: bloodVolume || 450,
      location: visit?.assignedRoom || 'N/A',
      doctor: visit?.assignedDoctor || 'N/A',
      bloodType: donor.bloodType,
      notes: notes || visit?.notes || '',
      systolic: visit?.systolic || null,
      diastolic: visit?.diastolic || null,
      heartRate: visit?.heartRate || null,
      temperature: visit?.temperature || null,
      hemoglobin: visit?.hemoglobin || null
    };
    
    updateDonor(donorId, {
      status: 'completed',
      totalDonations: donor.totalDonations + 1,
      lastDonationDate: historyEntry.date,
      currentVisit: null,
      donationHistory: [historyEntry, ...(donor.donationHistory || [])]
    });
    addNotification(`Odběr krve dokončen!`, 'success');
  }, [getDonorById, updateDonor, addNotification]);

  const addDoctorNote = useCallback((donorId, note) => {
    const donor = getDonorById(donorId);
    if(!donor || !donor.currentVisit) return;
    updateDonor(donorId, {
      currentVisit: { ...donor.currentVisit, notes: note }
    });
  }, [getDonorById, updateDonor]);

  const searchDonors = useCallback((query) => {
    if (!query || !query.trim()) return donors;
    const q = query.toLowerCase().trim();
    return donors.filter(d =>
      d.firstName?.toLowerCase().includes(q) ||
      d.lastName?.toLowerCase().includes(q) ||
      d.middleName?.toLowerCase().includes(q) ||
      d.phone?.includes(q) ||
      d.id?.includes(q) ||
      d.bloodType?.toLowerCase().includes(q)
    );
  }, [donors]);

  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayDonors = donors.filter(d =>
      d.status !== 'registered' ||
      (d.donationHistory || []).some(h => h.date === today)
    );
    const inQueue = donors.filter(d => 
      ['checked-in', 'questionnaire', 'documents', 'pressure', 'blood-sample', 'awaiting-results', 'doctor-review'].includes(d.status)
    ).length;
    const activeDonations = donors.filter(d => d.status === 'donating').length;
    const rejected = donors.filter(d => d.status === 'rejected' && d.currentVisit?.checkedInAt && new Date(d.currentVisit.checkedInAt).toISOString().slice(0,10) === today).length;
    const completedToday = donors.filter(d => d.status === 'completed' || (d.donationHistory || []).some(h => h.date === today)).length;
    const totalBlood = donors.reduce((acc, d) => {
      const todayH = (d.donationHistory || []).find(h => h.date === today);
      return acc + (todayH ? todayH.bloodVolume : 0);
    }, 0);

    return { todayDonors: todayDonors.length, inQueue, activeDonations, rejected, completedToday, totalBlood };
  }, [donors]);

  const resetData = useCallback(() => {
    alert("Reset data not implemented for Firebase. Please clear collections in Firebase Console manually.");
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
    approveQuestionnaire,
    acceptDocuments,
    startPressure,
    approveVitals,
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
