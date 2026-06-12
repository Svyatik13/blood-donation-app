import React, { useState, useEffect } from 'react';
import { QrCode, Droplets, CalendarCheck, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import StatusScreen from './StatusScreen';
import DonorPathModal from './DonorPathModal';

export default function HomeTab({ onShowQuestionnaire }) {
  const { getActiveDonor, checkIn, t } = useApp();
  const donor = getActiveDonor();

  // Completion state tracking (sync with StatusScreen logic)
  const [showCompletion, setShowCompletion] = useState(false);
  const [showPathModal, setShowPathModal] = useState(false);
  
  useEffect(() => {
    if (donor?.status === 'checked-in' && !donor.currentVisit?.questionnaireCompleted) {
      onShowQuestionnaire();
    }
  }, [donor?.status, donor?.currentVisit?.questionnaireCompleted, onShowQuestionnaire]);

  useEffect(() => {
    if (donor?.status === 'completed') {
      const hasSeen = sessionStorage.getItem(`confetti_${donor.id}_${donor.totalDonations}`);
      if (!hasSeen) {
        setShowCompletion(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DC2626', '#FCA5A5', '#EF4444', '#FFFFFF']
        });
        sessionStorage.setItem(`confetti_${donor.id}_${donor.totalDonations}`, 'true');
        const timer = setTimeout(() => setShowCompletion(false), 5000);
        return () => clearTimeout(timer);
      } else {
        setShowCompletion(false);
      }
    } else {
      setShowCompletion(false);
    }
  }, [donor?.status, donor?.id, donor?.totalDonations]);

  if (!donor) return null;

  const getNextDonationInfo = () => {
    if (donor.isTestMode) return { canDonate: true, text: 'TEST MODE: No limits' };
    if (!donor.lastDonationDate) return null;
    const lastDate = new Date(donor.lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 60);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (nextDate <= today) {
      return { canDonate: true, text: t('next_donation_ready') };
    }

    const formatted = nextDate.toLocaleDateString('cs-CZ');
    return { canDonate: false, text: `${t('next_donation_date')} ${formatted}` };
  };

  const nextDonation = getNextDonationInfo();

  // Gamification Logic
  const donations = donor.totalDonations || 0;
  const milestones = [
    { target: 1, label: t('milestone_1'), color: '#3498DB' },
    { target: 5, label: t('milestone_5'), color: '#CD7F32' },
    { target: 10, label: t('milestone_10'), color: '#C0C0C0' },
    { target: 20, label: t('milestone_20'), color: '#FFD700' },
  ];
  
  const currentMilestoneIndex = milestones.findIndex(m => donations < m.target);
  const currentMilestone = currentMilestoneIndex === -1 ? milestones[milestones.length - 1] : milestones[currentMilestoneIndex];
  const prevMilestone = currentMilestoneIndex <= 0 ? { target: 0, color: '#64748B' } : milestones[currentMilestoneIndex - 1];
  
  // Prevent division by zero if it's the last milestone
  const targetDiff = Math.max(currentMilestone.target - prevMilestone.target, 1);
  const progressPercent = currentMilestoneIndex === -1 ? 100 : Math.min(
    ((donations - prevMilestone.target) / targetDiff) * 100,
    100
  );

  return (
    <div className="mob-content animate-fade-in">
      <h2 style={{ marginBottom: '1rem' }}>{t('greeting')} {donor.firstName}!</h2>

      {/* Gamification Section */}
      <div 
        className="mob-card" 
        style={{ marginBottom: '1.5rem', background: 'var(--doc-bg-darker)', cursor: 'pointer', transition: 'transform 0.2s', ':active': { transform: 'scale(0.98)' } }}
        onClick={() => setShowPathModal(true)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t('donor_path')}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--doc-text-muted)' }}>
              {t('donations_count')}: <strong style={{ color: '#fff' }}>{donations}</strong>
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '50%' }}>
            <Medal size={32} color={prevMilestone.color} style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }} />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 1s ease-out' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--doc-text-muted)' }}>
          <span>{prevMilestone.target > 0 ? prevMilestone.label : ''}</span>
          <span>{currentMilestone.target} ({currentMilestone.label})</span>
        </div>
      </div>

      {(donor.status === 'registered' || donor.status === 'scanned' || (donor.status === 'completed' && !showCompletion)) ? (
        <>
          {/* QR Code Section */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--mob-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {donor.status === 'registered' || donor.status === 'scanned' ? 'Покажите этот QR-код на стойке регистрации' : 'Ваш идентификатор'}
            </p>
            <div className="mob-qr">
              <QrCode size={160} color="var(--doc-text)" />
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '2px' }}>
              {donor.id.toUpperCase()}
            </p>
          </div>

          {nextDonation && (
            <div className="mob-card" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CalendarCheck size={22} />
                <span>{nextDonation.text}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <StatusScreen onShowQuestionnaire={onShowQuestionnaire} />
      )}

      {showPathModal && <DonorPathModal onClose={() => setShowPathModal(false)} />}
    </div>
  );
}
