import React from 'react';
import { useApp, bloodTypeColors } from '../../context/AppContext';

export default function CompletedList({ onSelectPatient }) {
  const { donors, docT } = useApp();

  const completedDonors = donors.filter((d) => d.status === 'completed');

  if (completedDonors.length === 0) {
    return (
      <div className="doc-empty animate-fade-in">
        <p>{docT('doc_completed_empty')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="doc-card">
        <div className="doc-card-header">
          <span>{docT('doc_sidebar_completed')} ({completedDonors.length})</span>
        </div>
        {completedDonors.map((donor) => {
          const initials = (donor.lastName?.[0] || '') + (donor.firstName?.[0] || '');
          const bgColor = bloodTypeColors[donor.bloodType] || '#64748B';
          const lastEntry = donor.donationHistory?.[0];

          return (
            <div
              className="doc-list-item animate-slide-up"
              style={{ opacity: 0.7 }}
              key={donor.id}
              onClick={() => onSelectPatient(donor.id)}
            >
              <div className="doc-list-item-avatar" style={{ backgroundColor: bgColor }}>
                {initials}
              </div>

              <div className="doc-list-item-info">
                <div className="doc-list-item-name">
                  {donor.lastName} {donor.firstName} {donor.middleName}
                  <span className="badge" style={{ backgroundColor: bgColor, color: '#fff', marginLeft: '0.5rem' }}>
                    {donor.bloodType}
                  </span>
                </div>
                {lastEntry && (
                  <div className="doc-list-item-meta">
                    {lastEntry.bloodVolume} ml · {lastEntry.location} · {lastEntry.doctor}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
