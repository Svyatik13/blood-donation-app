import React, { useState } from 'react';
import { Search, Droplets } from 'lucide-react';
import { useApp, bloodTypeColors } from '../context/AppContext';
import DoctorSidebar from './doctor/DoctorSidebar';
import StatsBar from './doctor/StatsBar';
import QueuePanel from './doctor/QueuePanel';
import ActiveDonations from './doctor/ActiveDonations';
import CompletedList from './doctor/CompletedList';
import PatientDetailModal from './doctor/PatientDetailModal';

export default function DoctorDashboard() {
  const { searchDonors } = useApp();
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
  };

  const handleCloseModal = () => {
    setSelectedPatientId(null);
  };

  const searchResults = searchQuery.trim()
    ? searchDonors(searchQuery)
    : [];

  return (
    <div className="doctor-panel">
      <DoctorSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="doc-main">
        <StatsBar />

        {activeTab === 'search' && (
          <div className="doc-search-container">
            <div className="doc-search-wrapper">
              <Search size={16} />
              <input
                className="doc-search-input"
                type="text"
                placeholder="Поиск по имени, телефону, группе крови..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="doc-content">
          {activeTab === 'queue' && (
            <QueuePanel onSelectPatient={handleSelectPatient} />
          )}

          {activeTab === 'active' && (
            <ActiveDonations onSelectPatient={handleSelectPatient} />
          )}

          {activeTab === 'completed' && (
            <CompletedList onSelectPatient={handleSelectPatient} />
          )}

          {activeTab === 'search' && (
            <div className="animate-fade-in">
              {searchQuery.trim() === '' ? (
                <div className="doc-empty">
                  <Search size={48} />
                  <p>Введите запрос для поиска доноров</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="doc-empty">
                  <Search size={48} />
                  <p>Ничего не найдено по запросу «{searchQuery}»</p>
                </div>
              ) : (
                <div className="doc-card">
                  <div className="doc-card-header">
                    <span>
                      Результаты ({searchResults.length})
                    </span>
                  </div>
                  {searchResults.map((donor) => {
                    const initials =
                      (donor.lastName?.[0] || '') +
                      (donor.firstName?.[0] || '');
                    const bgColor =
                      bloodTypeColors[donor.bloodType] || '#64748B';

                    return (
                      <div
                        className="doc-list-item"
                        key={donor.id}
                        onClick={() => handleSelectPatient(donor.id)}
                      >
                        <div
                          className="doc-list-item-avatar"
                          style={{ backgroundColor: bgColor }}
                        >
                          {initials}
                        </div>
                        <div className="doc-list-item-info">
                          <div className="doc-list-item-name">
                            {donor.lastName} {donor.firstName}{' '}
                            {donor.middleName}
                          </div>
                          <div className="doc-list-item-meta">
                            {donor.bloodType} · {donor.phone} ·{' '}
                            Донаций: {donor.totalDonations}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedPatientId && (
        <PatientDetailModal
          donorId={selectedPatientId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
