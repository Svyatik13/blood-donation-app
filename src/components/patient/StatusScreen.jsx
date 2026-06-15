import React from 'react';
import { FileWarning } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { colors, radii } from '../../theme';

export default function StatusScreen() {
  const { getActiveDonor, t, acknowledgeRejection } = useApp();
  const donor = getActiveDonor();

  if (!donor || donor.status !== 'rejected') return null;

  const visit = donor.currentVisit;

  return (
    <div className="mob-status-screen animate-slide-up">
      <div className="mob-status-icon" style={{ background: colors.primarySoft, color: colors.primary }}>
        <FileWarning size={40} />
      </div>
      <h2 className="mob-status-title">{t('status_rejected_title')}</h2>
      <p className="mob-status-desc">{t('status_rejected_desc')}</p>
      {visit?.rejectionReason && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: colors.primarySoft, borderRadius: radii.lg }}>
          <p style={{ color: colors.primary, fontWeight: 600, fontSize: '0.9rem' }}>
            {t('status_rejection_reason')} {visit.rejectionReason}
          </p>
        </div>
      )}
      <button
        className="mob-btn mob-btn-primary"
        style={{ marginTop: '1.5rem' }}
        onClick={() => acknowledgeRejection(donor.id)}
      >
        {t('btn_understand')}
      </button>
    </div>
  );
}
