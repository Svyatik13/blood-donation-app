import React from 'react';
import { Droplets, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HistoryTab() {
  const { getActiveDonor, t } = useApp();
  const donor = getActiveDonor();

  if (!donor) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('cs-CZ'); // Always show in local format, you can use Intl for better i18n
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mob-content animate-fade-in">
      <h2 style={{ marginBottom: '1rem' }}>{t('nav_history')}</h2>

      {donor.donationHistory && donor.donationHistory.length > 0 ? (
        donor.donationHistory.map((entry, idx) => (
          <div className="mob-history-card animate-slide-up" key={idx}>
            <div className="mob-history-icon">
              <Droplets size={24} color="#E74C3C" />
            </div>
            <div className="mob-history-info">
              <div className="mob-history-date">
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {formatDate(entry.date)}
              </div>
              <div className="mob-history-detail">
                {entry.location} · {entry.doctor}
              </div>
            </div>
            <div className="mob-history-volume">{entry.bloodVolume} ml</div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--doc-text-muted)', marginTop: '2rem' }}>
          {t('doc_modal_no_records')}
        </div>
      )}
    </div>
  );
}
