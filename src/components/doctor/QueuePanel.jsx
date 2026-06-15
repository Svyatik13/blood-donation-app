import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp, formatElapsed, bloodTypeColors } from '../../context/AppContext';

const validateVitals = (sys, dia, pulse, temp, hemo, gender, docT) => {
  const warnings = [];
  const s = sys ? parseFloat(sys) : null;
  const d = dia ? parseFloat(dia) : null;
  const p = pulse ? parseFloat(pulse) : null;
  const tVal = temp ? parseFloat(temp) : null;
  const h = hemo ? parseFloat(hemo) : null;

  if (s !== null && (s < 90 || s > 180)) {
    warnings.push(s > 180 ? docT('vitals_alert_high_bp') : docT('vitals_alert_low_bp'));
  } else if (d !== null && (d < 50 || d > 100)) {
    warnings.push(d > 100 ? docT('vitals_alert_high_bp') : docT('vitals_alert_low_bp'));
  }

  if (p !== null && (p < 50 || p > 100)) {
    warnings.push(docT('vitals_alert_pulse'));
  }

  if (tVal !== null && (tVal < 36.0 || tVal > 37.5)) {
    warnings.push(docT('vitals_alert_temp'));
  }

  const hgbLimit = gender === 'female' ? 125 : 135;
  if (h !== null && h < hgbLimit) {
    warnings.push(docT('vitals_alert_hemo'));
  }

  return warnings;
};

const getRiskyQuestions = (donor, docT) => {
  const answers = donor.currentVisit?.questionnaireAnswers;
  if (!answers) return [];
  const risky = [];
  if (answers.q1 === 'no') risky.push(docT('q_q1'));
  if (answers.q2 === 'yes') risky.push(docT('q_q2'));
  if (answers.q3 === 'yes') risky.push(docT('q_q3'));
  if (answers.q4 === 'yes') risky.push(docT('q_q4'));
  if (answers.q5 === 'yes') risky.push(docT('q_q5'));
  if (answers.q6 === 'yes') risky.push(docT('q_q6'));
  return risky;
};

export default function QueuePanel({ onSelectPatient }) {
  const { donors, approveQuestionnaire, approveVitals, rejectDonor, takeBloodSample, resultsReady, doctorApprove, ROOMS, DOCTORS, docT } = useApp();
  const [, setTick] = useState(0);

  // For doctor inputs
  const [vitals, setVitals] = useState({});
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
          const isPressureState = donor.status === 'pressure';

          if (isPressureState) {
            const donorVitals = vitals[donor.id] || { sys: '', dia: '', pulse: '', temp: '', hemo: '' };
            const activeWarnings = validateVitals(
              donorVitals.sys,
              donorVitals.dia,
              donorVitals.pulse,
              donorVitals.temp,
              donorVitals.hemo,
              donor.gender,
              docT
            );

            const handleAutofill = () => {
              const sys = Math.floor(Math.random() * 21) + 115; // 115 - 135
              const dia = Math.floor(Math.random() * 11) + 70;  // 70 - 80
              const pulse = Math.floor(Math.random() * 21) + 65; // 65 - 85
              const temp = (Math.random() * 0.6 + 36.2).toFixed(1); // 36.2 - 36.8
              const hemo = Math.floor(Math.random() * 26) + (donor.gender === 'female' ? 128 : 138); // Female 128-153, Male 138-163
              setVitals((v) => ({
                ...v,
                [donor.id]: { sys, dia, pulse, temp, hemo }
              }));
            };

            return (
              <div
                className="doc-list-item doc-list-item-vitals-active animate-slide-up"
                key={donor.id}
                onClick={() => onSelectPatient(donor.id)}
                style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
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
                       {visit?.questionnaireCompleted && getRiskyQuestions(donor, docT).length > 0 && (
                         <span style={{ color: 'var(--danger)', marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                           <AlertTriangle size={12} /> Pozor: Rizikový dotazník
                         </span>
                       )}
                     </div>
                     {visit?.questionnaireCompleted && getRiskyQuestions(donor, docT).length > 0 && (
                       <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--danger)', borderRadius: '4px' }}>
                         <div style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                           <AlertTriangle size={12} /> Nalezeno riziko:
                         </div>
                         <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: '#FDA4AF', listStyleType: 'disc' }}>
                           {getRiskyQuestions(donor, docT).map((qText, idx) => (
                             <li key={idx} style={{ marginBottom: '2px' }}>{qText}</li>
                           ))}
                         </ul>
                       </div>
                     )}
                   </div>
                 </div>

                {/* Vitals Form Body */}
                <div className="vitals-form-container" onClick={(e) => e.stopPropagation()}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--doc-text)', display: 'flex', justifyValues: 'space-between', justifyContent: 'space-between' }}>
                    <span>{docT('vitals_title')}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--doc-text-muted)', fontWeight: 'normal' }}>
                      ({donor.gender === 'female' ? 'Žena' : 'Muž'})
                    </span>
                  </h4>

                  <div className="vitals-grid">
                    {/* BP Card */}
                    <div className="vitals-card">
                      <label>{docT('vitals_bp')}</label>
                      <div className="vitals-input-row">
                        <input
                          type="number"
                          placeholder="Sys"
                          value={donorVitals.sys || ''}
                          onChange={(e) => setVitals(v => ({ ...v, [donor.id]: { ...donorVitals, sys: e.target.value } }))}
                        />
                        <span>/</span>
                        <input
                          type="number"
                          placeholder="Dia"
                          value={donorVitals.dia || ''}
                          onChange={(e) => setVitals(v => ({ ...v, [donor.id]: { ...donorVitals, dia: e.target.value } }))}
                        />
                        <span>{docT('vitals_unit_bp')}</span>
                      </div>
                    </div>

                    {/* Pulse Card */}
                    <div className="vitals-card">
                      <label>{docT('vitals_pulse')}</label>
                      <div className="vitals-input-row">
                        <input
                          type="number"
                          placeholder="Tep"
                          value={donorVitals.pulse || ''}
                          onChange={(e) => setVitals(v => ({ ...v, [donor.id]: { ...donorVitals, pulse: e.target.value } }))}
                        />
                        <span>{docT('vitals_unit_pulse')}</span>
                      </div>
                    </div>

                    {/* Temp Card */}
                    <div className="vitals-card">
                      <label>{docT('vitals_temp')}</label>
                      <div className="vitals-input-row">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="36.6"
                          value={donorVitals.temp || ''}
                          onChange={(e) => setVitals(v => ({ ...v, [donor.id]: { ...donorVitals, temp: e.target.value } }))}
                        />
                        <span>{docT('vitals_unit_temp')}</span>
                      </div>
                    </div>

                    {/* HGB Card */}
                    <div className="vitals-card">
                      <label>{docT('vitals_hemoglobin')}</label>
                      <div className="vitals-input-row">
                        <input
                          type="number"
                          placeholder="HGB"
                          value={donorVitals.hemo || ''}
                          onChange={(e) => setVitals(v => ({ ...v, [donor.id]: { ...donorVitals, hemo: e.target.value } }))}
                        />
                        <span>{docT('vitals_unit_hemo')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning Alerts */}
                  {activeWarnings.length > 0 && (
                    <div className="vitals-warning-banner animate-fade-in">
                      <AlertTriangle size={16} />
                      <div className="vitals-warning-list">
                        {activeWarnings.map((w, idx) => <div key={idx}>{w}</div>)}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="vitals-actions">
                    <div className="vitals-actions-left">
                      <button className="btn btn-sm btn-ghost" onClick={handleAutofill}>
                        {docT('vitals_btn_measure')}
                      </button>
                    </div>

                    <div className="vitals-actions-right">
                      <input
                        type="text"
                        className="doc-input-inline"
                        placeholder={docT('status_rejection_reason')}
                        value={rejections[donor.id] || ''}
                        onChange={(e) => setRejections(r => ({ ...r, [donor.id]: e.target.value }))}
                        style={{ width: '160px' }}
                      />
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        onClick={() => rejectDonor(donor.id, rejections[donor.id] || docT('doc_reject_pressure'))}
                      >
                        {docT('doc_btn_reject')}
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        disabled={!donorVitals.sys || !donorVitals.dia || !donorVitals.pulse || !donorVitals.temp || !donorVitals.hemo}
                        onClick={() => approveVitals(
                          donor.id,
                          parseFloat(donorVitals.sys),
                          parseFloat(donorVitals.dia),
                          parseFloat(donorVitals.pulse),
                          parseFloat(donorVitals.temp),
                          parseFloat(donorVitals.hemo)
                        )}
                      >
                        {docT('vitals_btn_approve')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

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
                     getRiskyQuestions(donor, docT).length > 0 ? (
                       <span style={{ color: 'var(--danger)', marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                         <AlertTriangle size={12} /> Pozor: Rizikový dotazník
                       </span>
                     ) : (
                       <span style={{ color: 'var(--success)', marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                         <CheckCircle2 size={12} /> {docT('status_labels')['questionnaire']}
                       </span>
                     )
                   )}
                 </div>
                 {visit?.questionnaireCompleted && getRiskyQuestions(donor, docT).length > 0 && (
                   <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--danger)', borderRadius: '4px' }}>
                     <div style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                       <AlertTriangle size={12} /> Nalezeno riziko:
                     </div>
                     <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: '#FDA4AF', listStyleType: 'disc' }}>
                       {getRiskyQuestions(donor, docT).map((qText, idx) => (
                         <li key={idx} style={{ marginBottom: '2px' }}>{qText}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>

              <div className="doc-list-item-actions" onClick={(e) => e.stopPropagation()}>
                {donor.status === 'questionnaire' && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--doc-text-muted)', marginRight: '1rem' }}>
                      {docT('doc_click_answers')}
                    </div>
                    <button className="btn btn-sm btn-info" onClick={() => approveQuestionnaire(donor.id)}>
                      Schválit dotazník
                    </button>
                    <input type="text" className="doc-input-inline" placeholder={docT('status_rejection_reason')}
                      value={rejections[donor.id] || ''} onChange={(e) => setRejections(r => ({ ...r, [donor.id]: e.target.value }))} />
                    <button className="btn btn-sm btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => rejectDonor(donor.id, rejections[donor.id] || docT('doc_reject_questionnaire'))}>
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
                    <button className="btn btn-sm btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => rejectDonor(donor.id, rejections[donor.id] || docT('doc_reject_blood'))}>
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
