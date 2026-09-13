import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface BottomNavProps {
  currentLanguage: Language;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentLanguage,
  activeTab,
  onTabChange,
}) => {
  const t = translations[currentLanguage];

  const navItems = [
    { id: 'home', label: t.homeNav, icon: 'cottage' },
    { id: 'services', label: t.servicesNav, icon: 'print_connect' },
    { id: 'books', label: t.booksNav, icon: 'menu_book' },
    { id: 'elearning', label: t.elearnNav, icon: 'school' },
    { id: 'portal', label: t.portalNav, icon: 'contact_support' },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-outline-variant/20 transition-colors"
      data-active-classes="text-secondary font-semibold"
    >
      <div className="flex justify-around items-center h-16 px-space-xs max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] h-14 transition-colors ${
                isActive
                  ? 'text-secondary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label-sm text-label-sm tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
