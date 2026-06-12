import React from 'react';
import { X, Medal, Droplets, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DonorPathModal({ onClose }) {
  const { getActiveDonor, t } = useApp();
  const donor = getActiveDonor();

  if (!donor) return null;

  const donations = donor.totalDonations || 0;

  const milestones = [
    { target: 1, label: t('milestone_1'), color: '#3498DB', desc: 'První darování krve' },
    { target: 5, label: t('milestone_5'), color: '#CD7F32', desc: 'Bronzová medaile hrdiny' },
    { target: 10, label: t('milestone_10'), color: '#C0C0C0', desc: 'Stříbrná medaile hrdiny' },
    { target: 20, label: t('milestone_20'), color: '#FFD700', desc: 'Zlatá medaile hrdiny' },
    { target: 50, label: 'Diamantový dárce', color: '#B9F2FF', desc: 'Nejvyšší ocenění za záchranu životů' },
  ];

  return (
    <div className="modal-overlay" style={{ position: 'absolute', zIndex: 100 }}>
      <div className="modal-content animate-slide-up" style={{ height: '100%', width: '100%', maxWidth: 'none', borderRadius: 0, display: 'flex', flexDirection: 'column', padding: 0, background: 'var(--mob-bg)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--mob-surface)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--mob-text)' }}>{t('donor_path')}</h2>
          <button className="modal-close-btn" onClick={onClose} style={{ background: 'transparent', color: 'var(--mob-text)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Path */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', background: 'var(--mob-bg)' }}>
          <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto' }}>
            
            {/* The vertical line */}
            <div style={{ position: 'absolute', left: '32px', top: '20px', bottom: '20px', width: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
            
            {/* The active progress line */}
            {donations > 0 && (
              <div style={{ position: 'absolute', left: '32px', top: '20px', height: `${Math.min(100, (donations / 50) * 100)}%`, width: '4px', background: 'var(--primary)', borderRadius: '4px', transition: 'height 1s ease-out' }} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* Start node */}
              <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 0 15px rgba(231,76,60,0.4)' }}>
                  <Droplets size={32} color="#fff" />
                </div>
                <div style={{ paddingTop: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--mob-text)' }}>Start</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--mob-text-muted)' }}>Vaše cesta začíná</div>
                </div>
              </div>

              {milestones.map((m, idx) => {
                const isReached = donations >= m.target;
                const isNext = donations < m.target && (idx === 0 || donations >= milestones[idx - 1].target);

                let iconColor = isReached ? m.color : '#64748B';
                let bgColor = isReached ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)';
                let glow = isReached ? `0 0 20px ${m.color}66` : 'none';

                if (isNext) {
                  bgColor = 'rgba(255,255,255,0.08)';
                  iconColor = m.color;
                  glow = `0 0 10px ${m.color}33`;
                }

                return (
                  <div key={m.target} style={{ display: 'flex', gap: '1.5rem', position: 'relative', opacity: isReached || isNext ? 1 : 0.5, transition: 'all 0.3s' }}>
                    <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: glow, border: isNext ? `2px dashed ${m.color}` : '2px solid transparent' }}>
                      <Medal size={32} color={iconColor} />
                    </div>
                    
                    <div style={{ paddingTop: '5px', flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: isReached ? m.color : 'var(--mob-text)' }}>
                        {m.target} {m.target === 1 ? 'donace' : 'donací'}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px', color: 'var(--mob-text)' }}>{m.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--mob-text-muted)', marginTop: '4px' }}>{m.desc}</div>
                      
                      {isReached && (
                        <div style={{ marginTop: '8px', color: 'var(--success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Dosaženo
                        </div>
                      )}
                      
                      {isNext && (
                        <div style={{ marginTop: '8px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>
                          Zbývá: {m.target - donations}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
