import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useApp, formatElapsed, bloodTypeColors } from '../../context/AppContext';

export default function QueuePanel({ onSelectPatient }) {
  const { donors, acceptDocuments, startPressure, approvePressure, rejectDonor, takeBloodSample, resultsReady, doctorApprove, ROOMS, DOCTORS, docT } = useApp();
  const [, setTick] = useState(0);

  // For doctor inputs
  const [pressure, setPressure] = useState({});
  const [rejections, setRejections] = useState({});
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const queueDonors = donors.filter((d) =>
    ['checked-in', 'questionnaire', 'documents', 'pressure', 'blood-sample', 'awaiting-results', 'doctor-review'].includes(d.status)
  );

  const getStatusLabel = (status) => docT('status_labels')?.[status] || status;

  if (queueDonors.length === 0) {
    return (
      <div className="doc-empty animate-fade-in">
        <Clock size={48} />
        <p>{docT('doc_queue_empty')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="doc-card">
        <div className="doc-card-header">
          <span>{docT('doc_sidebar_queue')} ({queueDonors.length})</span>
        </div>
        {queueDonors.map((donor) => {
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
                  <span style={{ color: 'var(--primary)', marginRight: '8px' }}>#{visit?.queueNumber}</span>
                  {donor.lastName} {donor.firstName} {donor.middleName}
                  <span className="badge" style={{ backgroundColor: bgColor, color: '#fff', marginLeft: '0.5rem' }}>
                    {donor.bloodType}
                  </span>
                  <span className={`badge badge-${donor.status}`} style={{ marginLeft: '0.5rem' }}>
                    {getStatusLabel(donor.status)}
                  </span>
                </div>
                <div className="doc-list-item-meta">
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {formatElapsed(visit?.checkedInAt)}
                  {visit?.questionnaireCompleted && (
                    <span style={{ color: 'var(--success)', marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> {docT('status_labels')['questionnaire']}
                    </span>
                  )}
                </div>
              </div>

              <div className="doc-list-item-actions" onClick={(e) => e.stopPropagation()}>
                {donor.status === 'questionnaire' && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--doc-text-muted)', marginRight: '1rem' }}>
                      (Klikněte pro zobrazení odpovědí)
                    </div>
                    <button className="btn btn-sm btn-info" onClick={() => acceptDocuments(donor.id)}>
                      {docT('doc_btn_docs_ok')}
                    </button>
                    <input type="text" className="doc-input-inline" placeholder={docT('status_rejection_reason')}
                      value={rejections[donor.id] || ''} onChange={(e) => setRejections(r => ({ ...r, [donor.id]: e.target.value }))} />
                    <button className="btn btn-sm btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => rejectDonor(donor.id, rejections[donor.id] || 'Zamítnuto po dotazníku')}>
                      {docT('doc_btn_reject')}
                    </button>
                  </div>
                )}
                {donor.status === 'documents' && (
                  <button className="btn btn-sm btn-primary" onClick={() => startPressure(donor.id)}>
                    {docT('doc_btn_start_pressure')}
                  </button>
                )}
                {donor.status === 'pressure' && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="number" className="doc-input-inline" placeholder="Sys" style={{ width: '60px' }}
                      value={pressure[donor.id]?.sys || ''} onChange={(e) => setPressure(p => ({ ...p, [donor.id]: { ...p[donor.id], sys: e.target.value } }))} />
                    <span>/</span>
                    <input type="number" className="doc-input-inline" placeholder="Dia" style={{ width: '60px' }}
                      value={pressure[donor.id]?.dia || ''} onChange={(e) => setPressure(p => ({ ...p, [donor.id]: { ...p[donor.id], dia: e.target.value } }))} />
                    <button className="btn btn-sm btn-success" onClick={() => approvePressure(donor.id, pressure[donor.id]?.sys, pressure[donor.id]?.dia)}>
                      OK
                    </button>
                    <input type="text" className="doc-input-inline" placeholder={docT('status_rejection_reason')}
                      value={rejections[donor.id] || ''} onChange={(e) => setRejections(r => ({ ...r, [donor.id]: e.target.value }))} />
                    <button className="btn btn-sm btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => rejectDonor(donor.id, rejections[donor.id] || 'Nízký/Vysoký tlak')}>
                      {docT('doc_btn_reject')}
                    </button>
                  </div>
                )}
                {donor.status === 'blood-sample' && (
                  <button className="btn btn-sm btn-info" onClick={() => takeBloodSample(donor.id)}>
                    {docT('doc_btn_sample_taken')}
                  </button>
                )}
                {donor.status === 'awaiting-results' && (
                  <button className="btn btn-sm btn-primary" onClick={() => resultsReady(donor.id)}>
                    {docT('doc_btn_results_ok')}
                  </button>
                )}
                {donor.status === 'doctor-review' && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select className="doc-select" value={assignments[donor.id]?.room || ROOMS[0]} onChange={(e) => setAssignments(a => ({ ...a, [donor.id]: { ...a[donor.id], room: e.target.value } }))}>
                      {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select className="doc-select" value={assignments[donor.id]?.doc || DOCTORS[0]} onChange={(e) => setAssignments(a => ({ ...a, [donor.id]: { ...a[donor.id], doc: e.target.value } }))}>
                      {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <button className="btn btn-sm btn-success" onClick={() => doctorApprove(donor.id, assignments[donor.id]?.room || ROOMS[0], assignments[donor.id]?.doc || DOCTORS[0])}>
                      {docT('doc_btn_approve')}
                    </button>
                    <input type="text" className="doc-input-inline" placeholder={docT('status_rejection_reason')}
                      value={rejections[donor.id] || ''} onChange={(e) => setRejections(r => ({ ...r, [donor.id]: e.target.value }))} />
                    <button className="btn btn-sm btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => rejectDonor(donor.id, rejections[donor.id] || 'Špatné výsledky krve')}>
                      {docT('doc_btn_reject')}
                    </button>
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
