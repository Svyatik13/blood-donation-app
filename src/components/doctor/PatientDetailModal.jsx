import React, { useState, useEffect } from 'react';
import { X, Droplets, Calendar, Save } from 'lucide-react';
import { useApp, bloodTypeColors } from '../../context/AppContext';

export default function PatientDetailModal({ donorId, onClose }) {
  const { getDonorById, addDoctorNote, docT } = useApp();
  const donor = getDonorById(donorId);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (donor?.currentVisit?.notes) {
      setNoteText(donor.currentVisit.notes);
    }
  }, [donor?.currentVisit?.notes]);

  if (!donor) return null;

  const visit = donor.currentVisit;
  const bgColor = bloodTypeColors[donor.bloodType] || '#64748B';

  const handleSaveNote = () => {
    addDoctorNote(donor.id, noteText);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('cs-CZ');
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString('cs-CZ', { hour: '2-digit', minute:'2-digit' });
    } catch {
      return '—';
    }
  };

  const getStatusLabel = (status) => docT('status_labels')?.[status] || status;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content animate-slide-up">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>
              {visit?.queueNumber && <span style={{color: 'var(--primary)', marginRight: '8px'}}>#{visit.queueNumber}</span>}
              {donor.lastName} {donor.firstName} {donor.middleName}
            </h2>
            <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span
                className="badge"
                style={{ backgroundColor: bgColor, color: '#fff' }}
              >
                <Droplets size={11} /> {donor.bloodType}
              </span>
              <span className={`badge badge-${donor.status}`}>
                {getStatusLabel(donor.status)}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Personal Data */}
          <div className="modal-section">
            <div className="modal-section-title">{docT('doc_modal_title_pers')}</div>
            <div className="modal-grid">
              <div className="modal-field">
                <span className="modal-field-label">{docT('dob')}</span>
                <span className="modal-field-value">
                  {formatDate(donor.dateOfBirth)}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">{docT('gender')}</span>
                <span className="modal-field-value">
                  {donor.gender === 'male' ? docT('male') : docT('female')}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">Telefon</span>
                <span className="modal-field-value">{donor.phone || '—'}</span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">{docT('email')}</span>
                <span className="modal-field-value">{donor.email || '—'}</span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">{docT('passport')}</span>
                <span className="modal-field-value">
                  {donor.passportNumber || '—'}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">{docT('address')}</span>
                <span className="modal-field-value">
                  {donor.address || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="modal-section">
            <div className="modal-section-title">{docT('doc_modal_title_med')}</div>
            <div className="modal-grid">
              <div className="modal-field">
                <span className="modal-field-label">{docT('weight')}</span>
                <span className="modal-field-value">
                  {donor.weight ? `${donor.weight} kg` : '—'}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">{docT('chronic_diseases')}</span>
                <span className="modal-field-value">
                  {donor.chronicDiseases || '—'}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">{docT('allergies')}</span>
                <span className="modal-field-value">
                  {donor.allergies || '—'}
                </span>
              </div>
              <div className="modal-field">
                <span className="modal-field-label">{docT('medications')}</span>
                <span className="modal-field-value">
                  {donor.medications || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Current Visit */}
          {visit && (
            <div className="modal-section">
              <div className="modal-section-title">{docT('doc_modal_title_visit')}</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <span className="modal-field-label">Příjezd</span>
                  <span className="modal-field-value">
                    {formatTimestamp(visit.checkedInAt)}
                  </span>
                </div>
                <div className="modal-field">
                  <span className="modal-field-label">Dotazník</span>
                  <span className="modal-field-value">
                    {visit.questionnaireCompleted ? 'OK' : '...'}
                  </span>
                </div>
                {visit.questionnaireAnswers && (
                  <div className="modal-field" style={{ gridColumn: 'span 2' }}>
                    <span className="modal-field-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Odpovědi v dotazníku</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--doc-bg)', padding: '1rem', borderRadius: '8px' }}>
                      {[
                        { id: 'q1', text: docT('q_q1'), ok: 'yes' },
                        { id: 'q2', text: docT('q_q2'), ok: 'no' },
                        { id: 'q3', text: docT('q_q3'), ok: 'no' },
                        { id: 'q4', text: docT('q_q4'), ok: 'no' },
                        { id: 'q5', text: docT('q_q5'), ok: 'no' },
                        { id: 'q6', text: docT('q_q6'), ok: 'no' },
                      ].map((q, idx) => {
                        const ans = visit.questionnaireAnswers[q.id];
                        const isOk = ans === q.ok;
                        return (
                          <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', borderBottom: idx < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: idx < 5 ? '0.5rem' : 0 }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--doc-text)' }}>{idx + 1}. {q.text}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isOk ? 'var(--success)' : 'var(--danger)', padding: '2px 8px', borderRadius: '4px', background: isOk ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                              {ans === 'yes' ? docT('q_yes') : docT('q_no')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="modal-field">
                  <span className="modal-field-label">Tlak</span>
                  <span className="modal-field-value">
                    {visit.systolic && visit.diastolic ? `${visit.systolic}/${visit.diastolic}` : '—'}
                  </span>
                </div>
                <div className="modal-field">
                  <span className="modal-field-label">Vzorek</span>
                  <span className="modal-field-value">
                    {visit.bloodSampleTakenAt ? formatTimestamp(visit.bloodSampleTakenAt) : '—'}
                  </span>
                </div>
                <div className="modal-field">
                  <span className="modal-field-label">Místnost</span>
                  <span className="modal-field-value">
                    {visit.assignedRoom || '—'}
                  </span>
                </div>
                <div className="modal-field">
                  <span className="modal-field-label">Objem</span>
                  <span className="modal-field-value">
                    {visit.bloodVolume ? `${visit.bloodVolume} ml` : '—'}
                  </span>
                </div>
                {visit.rejectionReason && (
                  <div className="modal-field" style={{ gridColumn: 'span 2' }}>
                    <span className="modal-field-label" style={{ color: 'var(--danger)' }}>{docT('status_rejection_reason')}</span>
                    <span className="modal-field-value" style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                      {visit.rejectionReason}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span className="modal-field-label">{docT('doc_modal_notes')}</span>
                <textarea
                  className="doc-notes-textarea"
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="..."
                />
                <button
                  className="btn btn-sm btn-primary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={handleSaveNote}
                >
                  <Save size={14} /> {docT('doc_btn_save')}
                </button>
              </div>
            </div>
          )}

          {/* Donation History */}
          <div className="modal-section">
            <div className="modal-section-title">{docT('doc_modal_title_hist')}</div>
            {donor.donationHistory && donor.donationHistory.length > 0 ? (
              donor.donationHistory.map((entry, idx) => (
                <div className="modal-history-item" key={idx}>
                  <Calendar size={16} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {formatDate(entry.date)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--doc-text-muted)',
                      }}
                    >
                      {entry.bloodVolume} ml · {entry.location} ·{' '}
                      {entry.doctor}
                      {entry.notes ? ` · ${entry.notes}` : ''}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--doc-text-muted)',
                }}
              >
                {docT('doc_modal_no_records')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
