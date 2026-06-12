import React, { useState, useEffect } from 'react';
import { Clock, Activity } from 'lucide-react';
import { useApp, formatElapsed, bloodTypeColors } from '../../context/AppContext';

export default function ActiveDonations({ onSelectPatient }) {
  const { donors, completeDonation, docT } = useApp();
  const [, setTick] = useState(0);
  const [volumes, setVolumes] = useState({});
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeDonors = donors.filter((d) => d.status === 'donating');

  const handleComplete = (donorId) => {
    const volume = volumes[donorId] !== undefined ? Number(volumes[donorId]) : 450;
    const note = notes[donorId] || '';
    completeDonation(donorId, volume, note);
    setVolumes((prev) => {
      const next = { ...prev };
      delete next[donorId];
      return next;
    });
    setNotes((prev) => {
      const next = { ...prev };
      delete next[donorId];
      return next;
    });
  };

  if (activeDonors.length === 0) {
    return (
      <div className="doc-empty animate-fade-in">
        <Activity size={48} />
        <p>{docT('doc_active_empty')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="doc-card">
        <div className="doc-card-header">
          <span>{docT('doc_sidebar_active')} ({activeDonors.length})</span>
        </div>
        {activeDonors.map((donor) => {
          const initials = (donor.lastName?.[0] || '') + (donor.firstName?.[0] || '');
          const bgColor = bloodTypeColors[donor.bloodType] || '#64748B';
          const visit = donor.currentVisit;

          return (
            <div
              className="doc-list-item animate-slide-up"
              key={donor.id}
              onClick={() => onSelectPatient(donor.id)}
            >
              <div className="doc-list-item-avatar" style={{ backgroundColor: bgColor }}>
                {initials}
              </div>

              <div className="doc-list-item-info">
                <div className="doc-list-item-name">
                  {donor.lastName} {donor.firstName} {donor.middleName}
                </div>
                <div className="doc-list-item-meta">
                  {visit?.assignedRoom} · {visit?.assignedDoctor}
                </div>
              </div>

              {donor.status === 'donating' && (
                <>
                  <div className="donation-timer">
                    <Clock size={14} className="animate-pulse" />
                    <span>{formatElapsed(visit?.donationStartedAt)}</span>
                  </div>

                  <div className="doc-list-item-actions" onClick={(e) => e.stopPropagation()}>
                    <input
                      className="doc-input-inline"
                      type="number"
                      min="100"
                      max="600"
                      placeholder="450"
                      value={volumes[donor.id] ?? ''}
                      onChange={(e) => setVolumes((prev) => ({ ...prev, [donor.id]: e.target.value }))}
                    />
                    <textarea
                      className="doc-notes-textarea"
                      rows={1}
                      placeholder={docT('doc_modal_notes')}
                      value={notes[donor.id] ?? ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [donor.id]: e.target.value }))}
                    />
                    <button className="btn btn-sm btn-success" onClick={() => handleComplete(donor.id)}>
                      {docT('doc_btn_finish_donation')}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
