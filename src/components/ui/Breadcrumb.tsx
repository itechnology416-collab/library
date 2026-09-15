import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  showHomeIcon = true,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-on-surface-variant font-medium overflow-x-auto whitespace-nowrap py-1 ${className}`}
    >
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.active;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-outline-variant/60 shrink-0" />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-on-surface select-none truncate max-w-[200px]"
                >
                  {index === 0 && showHomeIcon && (
                    <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                  )}
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-secondary transition-colors cursor-pointer flex items-center gap-1 truncate max-w-[160px]"
                >
                  {index === 0 && showHomeIcon && <Home className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="hover:text-secondary transition-colors flex items-center gap-1 truncate max-w-[160px]"
                >
                  {index === 0 && showHomeIcon && <Home className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span className="truncate max-w-[160px]">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
