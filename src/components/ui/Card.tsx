import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  borderAccent?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  borderAccent = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl bg-surface-container-lowest border border-outline-variant/20 p-5 transition-all duration-200 ${
        borderAccent ? 'border-t-4 border-t-secondary' : ''
      } ${
        hoverEffect
          ? 'hover:border-secondary/40 hover:shadow-md hover:-translate-y-0.5'
          : 'shadow-xs'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
