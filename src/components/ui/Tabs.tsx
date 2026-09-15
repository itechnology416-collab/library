import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'pills' | 'underline' | 'cards';
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'pills',
  fullWidth = false,
}) => {
  return (
    <div className={`w-full overflow-x-auto no-scrollbar ${className}`}>
      <div
        role="tablist"
        className={`flex items-center gap-1.5 p-1 ${
          variant === 'pills'
            ? 'bg-surface-container-low rounded-2xl border border-outline-variant/30'
            : variant === 'underline'
            ? 'border-b border-outline-variant/30 gap-4 p-0'
            : 'gap-2 p-0'
        } ${fullWidth ? 'w-full' : 'inline-flex'}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          let tabStyle = '';
          if (variant === 'pills') {
            tabStyle = isActive
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container';
          } else if (variant === 'underline') {
            tabStyle = isActive
              ? 'border-b-2 border-secondary text-secondary font-bold pb-2'
              : 'border-b-2 border-transparent text-on-surface-variant hover:text-on-surface pb-2';
          } else if (variant === 'cards') {
            tabStyle = isActive
              ? 'bg-surface-container-lowest border-2 border-secondary text-on-surface shadow-xs'
              : 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container';
          }

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none ${
                fullWidth ? 'flex-1' : ''
              } ${tabStyle}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-on-secondary/20 text-on-secondary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
