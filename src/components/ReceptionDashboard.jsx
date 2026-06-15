import React, { useState } from 'react';
import { useApp, bloodTypeColors, formatElapsed } from '../context/AppContext';
import { Users, Search, CheckCircle, ClipboardList, Clock } from 'lucide-react';

export default function ReceptionDashboard() {
  const { donors, acceptDocuments, searchDonors, docT } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Get only donors who have their questionnaire approved by doctor (ready for document check)
  const pendingDonors = donors.filter((d) => d.status === 'documents');

  const searchResults = searchQuery.trim()
    ? searchDonors(searchQuery).filter(d => ['registered', 'checked-in', 'questionnaire', 'documents'].includes(d.status))
    : [];

  const handleVerifyAndCheckIn = (id) => {
    acceptDocuments(id);
  };

  return (
    <div className="doctor-panel">
      {/* Sidebar inline for simplicity */}
      <div className="doc-sidebar">
        <div className="doc-sidebar-logo">
          <div className="logo-icon" style={{ background: '#3498DB' }}>
            <ClipboardList size={20} />
          </div>
          <h2 style={{ color: '#3498DB' }}>{docT('reception_title')}</h2>
        </div>

        <div className="doc-nav">
          <button className="doc-nav-item active" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498DB' }}>
            <Users size={18} />
            <span>{docT('reception_waiting')}</span>
            <span className="doc-nav-badge" style={{ background: '#3498DB' }}>{pendingDonors.length}</span>
          </button>
        </div>
      </div>

      <div className="doc-main">
        <div style={{ background: 'var(--doc-surface)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--doc-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--doc-text)' }}>{docT('reception_panel_title')}</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--doc-text-muted)' }}>{docT('reception_panel_desc')}</p>
          </div>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--doc-text-muted)' }} />
            <input 
              type="text" 
              placeholder={docT('reception_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid var(--doc-border)', background: 'var(--doc-bg)' }}
            />
          </div>
        </div>

        <div className="doc-content" style={{ padding: '1.5rem' }}>
          
          {searchQuery.trim() !== '' ? (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{docT('reception_search_results')} ({searchResults.length})</h2>
              {searchResults.length === 0 ? (
                <div className="doc-empty">
                  <Search size={48} />
                  <p>{docT('reception_not_found')}</p>
                </div>
              ) : (
                <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {searchResults.map(donor => <DonorCard key={donor.id} donor={donor} onCheckIn={handleVerifyAndCheckIn} docT={docT} />)}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem' }}>{docT('reception_pending')}</h2>
              </div>
              
              {pendingDonors.length === 0 ? (
                <div className="doc-empty">
                  <CheckCircle size={48} color="#059669" />
                  <p>{docT('reception_all_done')}</p>
                </div>
              ) : (
                <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {pendingDonors.map((donor) => (
                    <DonorCard key={donor.id} donor={donor} onCheckIn={handleVerifyAndCheckIn} docT={docT} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function DonorCard({ donor, onCheckIn, docT }) {
  const initials = (donor.lastName?.[0] || '') + (donor.firstName?.[0] || '');
  const bgColor = bloodTypeColors[donor.bloodType] || '#64748B';

  return (
    <div className="doc-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bgColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '1rem' }}>{donor.lastName} {donor.firstName} {donor.middleName}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--doc-text-muted)' }}>ID: {donor.id} • {donor.phone}</div>
        </div>
      </div>
      
      <div style={{ background: 'var(--doc-bg)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: 'var(--doc-text-muted)' }}>{docT('reception_id_doc')}</span>
          <span style={{ fontWeight: 500 }}>{donor.passportNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--doc-text-muted)' }}>{docT('reception_blood_group')}</span>
          <span style={{ fontWeight: 600, color: bgColor }}>{donor.bloodType}</span>
        </div>
      </div>

      {donor.status === 'documents' ? (
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#3498DB' }}
          onClick={() => onCheckIn(donor.id)}
        >
          <CheckCircle size={18} />
          {docT('reception_verify')}
        </button>
      ) : (
        <button className="btn btn-ghost" disabled style={{ width: '100%', color: '#059669', background: 'rgba(5, 150, 105, 0.1)' }}>
          <CheckCircle size={18} />
          {docT('reception_done')}
        </button>
      )}
    </div>
  );
}
