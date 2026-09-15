import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      children,
      className = '',
      containerClassName = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-on-surface select-none tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full appearance-none rounded-xl bg-surface-container-low border text-sm text-on-surface transition-all duration-200 outline-none pl-3.5 pr-10 py-2.5 cursor-pointer
              ${
                error
                  ? 'border-error ring-1 ring-error focus:border-error focus:ring-2 focus:ring-error/20'
                  : 'border-outline-variant/30 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-container-high' : 'hover:border-outline-variant/60'}
              ${className}
            `}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <span className="text-xs font-medium text-error">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-on-surface-variant/80">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
