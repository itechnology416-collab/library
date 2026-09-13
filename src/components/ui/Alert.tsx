import React from 'react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-sky-500/10 border-sky-500/30 text-sky-900 dark:text-sky-200',
      icon: 'info',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      icon: 'check_circle',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
      icon: 'warning',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    error: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200',
      icon: 'error',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  };

  const config = configs[type];

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${config.bg} ${className}`}
    >
      <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${config.iconColor}`}>
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-bold text-sm mb-0.5">{title}</h5>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface p-0.5 rounded cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
};
