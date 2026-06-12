import React from 'react';
import { Home, Clock, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MobileNavBar({ activeTab, onTabChange }) {
  const { t } = useApp();
  
  const navItems = [
    { id: 'home', icon: Home, label: t('nav_home') },
    { id: 'history', icon: Clock, label: t('nav_history') },
    { id: 'profile', icon: User, label: t('nav_profile') },
  ];

  return (
    <nav className="mob-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`mob-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
