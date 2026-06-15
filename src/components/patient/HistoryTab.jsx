import React from 'react';
import { Droplets, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { colors, radii, spacing } from '../../theme';

export default function HistoryTab() {
  const { getActiveDonor, t } = useApp();
  const donor = getActiveDonor();

  if (!donor) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('cs-CZ', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mob-content animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 700 }}>
        {t('nav_history')}
      </h2>

      {donor.donationHistory && donor.donationHistory.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {donor.donationHistory.map((entry, idx) => (
            <div
              key={idx}
              className="animate-slide-up"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${colors.primary}`,
                borderRadius: radii.lg,
                padding: `${spacing.md}px`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: radii.md,
                background: colors.primarySoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Droplets size={20} color={colors.primary} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: colors.text }}>
                    {formatDate(entry.date)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: colors.textMuted, fontWeight: 600 }}>
                    #{donor.donationHistory.length - idx}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: colors.textMuted, marginTop: 2 }}>
                  {entry.doctor}
                </div>
              </div>

              <div style={{
                background: colors.primarySoft,
                color: colors.primary,
                fontWeight: 800,
                fontSize: '0.95rem',
                padding: `${spacing.xs}px ${spacing.sm + 2}px`,
                borderRadius: radii.full,
                flexShrink: 0,
              }}>
                {entry.bloodVolume} ml
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          color: colors.textMuted,
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: spacing.md,
        }}>
          <Activity size={40} color={colors.border} />
          <p style={{ fontSize: '0.9rem' }}>{t('doc_modal_no_records')}</p>
        </div>
      )}
    </div>
  );
}
