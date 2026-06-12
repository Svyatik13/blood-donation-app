import React from 'react';
import { Users, Droplets, FileWarning, CheckCircle2, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StatsBar() {
  const { getTodayStats, docT } = useApp();
  const stats = getTodayStats();

  const cards = [
    {
      label: docT('doc_stats_queue'),
      value: stats.inQueue,
      colorClass: 'warning',
      icon: Users,
    },
    {
      label: docT('doc_stats_active'),
      value: stats.activeDonations,
      colorClass: 'primary',
      icon: Activity,
    },
    {
      label: docT('doc_stats_rejected'),
      value: stats.rejected,
      colorClass: 'info',
      icon: FileWarning,
    },
    {
      label: docT('doc_stats_completed'),
      value: stats.completedToday,
      colorClass: 'success',
      icon: CheckCircle2,
    },
    {
      label: docT('doc_stats_volume'),
      value: stats.totalBlood + ' ml',
      colorClass: 'primary',
      icon: Droplets,
    },
  ];

  return (
    <div className="doc-stats-bar">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div className="stat-card" key={card.label}>
            <div className="stat-card-label">{card.label}</div>
            <div className={`stat-card-value ${card.colorClass}`}>
              {card.value}
            </div>
            <div className="stat-card-sub">
              <Icon size={12} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
