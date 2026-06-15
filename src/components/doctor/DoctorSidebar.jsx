import React from 'react';
import {
  Droplets,
  Users,
  Activity,
  CheckCircle2,
  Search,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DoctorSidebar({ activeTab, onTabChange }) {
  const { donors, resetData, docT } = useApp();

  const queueCount = donors.filter((d) =>
    ['checked-in', 'questionnaire', 'documents', 'pressure', 'blood-sample', 'awaiting-results', 'doctor-review'].includes(d.status)
  ).length;

  const activeCount = donors.filter((d) =>
    ['donating'].includes(d.status)
  ).length;

  const completedCount = donors.filter(
    (d) => d.status === 'completed'
  ).length;

  const navItems = [
    {
      id: 'queue',
      label: docT('doc_sidebar_queue'),
      icon: Users,
      badgeCount: queueCount,
      badgeClass: 'warning',
    },
    {
      id: 'active',
      label: docT('doc_sidebar_active'),
      icon: Activity,
      badgeCount: activeCount,
      badgeClass: '',
    },
    {
      id: 'completed',
      label: docT('doc_sidebar_completed'),
      icon: CheckCircle2,
      badgeCount: completedCount,
      badgeClass: 'success',
    },
    {
      id: 'search',
      label: docT('doc_sidebar_search'),
      icon: Search,
      badgeCount: 0,
      badgeClass: '',
    },
  ];

  return (
    <div className="doc-sidebar">
      <div className="doc-sidebar-logo">
        <div className="logo-icon">
          <Droplets size={18} />
        </div>
        <h2>Odběr krve</h2>
      </div>

      <nav className="doc-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`doc-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={18} />
              {item.label}
              {item.badgeCount > 0 && (
                <span className={`doc-nav-badge ${item.badgeClass}`}>
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '0 0.5rem' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ width: '100%' }}
          onClick={resetData}
        >
          <RotateCcw size={14} />
          {docT('doc_sidebar_reset')}
        </button>
      </div>
    </div>
  );
}
