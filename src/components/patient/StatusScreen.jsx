import React, { useState, useEffect } from 'react';
import { Clock, ClipboardCheck, Heart, ShieldCheck, FileWarning, Award, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StatusScreen({ onShowQuestionnaire }) {
  const { getActiveDonor, t, updateDonor, acknowledgeRejection, lang } = useApp();
  const donor = getActiveDonor();
  const [showCompletion, setShowCompletion] = useState(true);

  useEffect(() => {
    if (donor?.status === 'completed') {
      const timer = setTimeout(() => {
        setShowCompletion(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowCompletion(true);
    }
  }, [donor?.status]);

  if (!donor) return null;

  const visit = donor.currentVisit;

  if (donor.status === 'checked-in') {
    return (
      <div className="mob-status-screen animate-slide-up">
        <div className="mob-status-icon" style={{ background: 'var(--warning-soft)' }}>
          <Clock size={40} />
        </div>
        <h2 className="mob-status-title">
          {t('status_queue_title')} <span style={{ color: 'var(--primary)' }}>#{visit?.queueNumber || '-'}</span>
        </h2>
        <p className="mob-status-desc">{t('status_queue_desc')}</p>
        {!visit?.questionnaireCompleted && onShowQuestionnaire && (
          <button
            className="mob-btn mob-btn-primary"
            onClick={onShowQuestionnaire}
            style={{ marginTop: '1rem' }}
          >
            <ClipboardCheck size={18} />
            {t('btn_fill_questionnaire')}
          </button>
        )}
      </div>
    );
  }

  if (donor.status === 'questionnaire') {
    return (
      <div className="mob-status-screen animate-slide-up">
        <div className="mob-status-icon" style={{ background: 'var(--info-soft)' }}>
          <ClipboardCheck size={40} />
        </div>
        <h2 className="mob-status-title">{t('status_questionnaire_title')}</h2>
        <p className="mob-status-desc">{t('status_questionnaire_desc')}</p>
      </div>
    );
  }

  // Grouped physical prep stages
  if (['documents', 'pressure', 'blood-sample'].includes(donor.status)) {
    return (
      <div className="mob-status-screen animate-slide-up">
        <div className="mob-status-icon animate-pulse" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
          <Activity size={40} />
        </div>
        <h2 className="mob-status-title">{t('status_prep_title')}</h2>
        <p className="mob-status-desc">{t('status_prep_desc')}</p>
      </div>
    );
  }

  if (donor.status === 'awaiting-results') {
    return (
      <div className="mob-status-screen animate-slide-up">
        <div className="mob-status-icon animate-pulse" style={{ background: 'rgba(126, 34, 206, 0.1)', color: '#7E22CE' }}>
          <ShieldCheck size={40} />
        </div>
        <h2 className="mob-status-title">{t('status_awaiting_title')}</h2>
        <p className="mob-status-desc">{t('status_awaiting_desc')}</p>
      </div>
    );
  }

  if (['doctor-review', 'donating'].includes(donor.status)) {
    return (
      <div className="mob-status-screen animate-slide-up">
        <div className="mob-status-icon animate-pulse" style={{ background: 'var(--primary-soft)' }}>
          <Heart size={40} />
        </div>
        <h2 className="mob-status-title">{t('status_donating_title')}</h2>
        <p className="mob-status-desc">{t('status_donating_desc')}</p>
      </div>
    );
  }

  if (donor.status === 'completed' && showCompletion) {
    return (
      <div className="mob-status-screen animate-slide-up">
        <div className="mob-status-icon" style={{ background: 'var(--success-soft)' }}>
          <Award size={40} />
        </div>
        <h2 className="mob-status-title">{t('status_completed_title')}</h2>
        <p className="mob-status-desc">{t('status_completed_desc')}</p>
      </div>
    );
  }

  if (donor.status === 'rejected') {
    return (
      <div className="mob-status-screen animate-slide-up">
        <div className="mob-status-icon" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
          <FileWarning size={40} />
        </div>
        <h2 className="mob-status-title">{t('status_rejected_title')}</h2>
        <p className="mob-status-desc">{t('status_rejected_desc')}</p>
        {visit?.rejectionReason && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '10px' }}>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              {t('status_rejection_reason')} {visit.rejectionReason}
            </p>
          </div>
        )}
        <button
          className="mob-btn mob-btn-primary"
          style={{ marginTop: '1.5rem' }}
          onClick={() => acknowledgeRejection(donor.id)}
        >
          {lang === 'uk' ? 'Зрозуміло' : 'Rozumím'}
        </button>
      </div>
    );
  }

  return null;
}
