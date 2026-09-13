import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon,
}) => {
  const variantStyles = {
    primary: 'bg-secondary/15 text-secondary border border-secondary/30',
    success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    info: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30',
    neutral: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-bold rounded-md gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center tracking-wide uppercase select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
