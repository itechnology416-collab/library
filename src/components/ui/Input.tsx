import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-on-surface select-none tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-on-surface-variant pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full rounded-xl bg-surface-container-low border text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-200 outline-none
              ${leftIcon ? 'pl-10' : 'pl-3.5'}
              ${rightIcon ? 'pr-10' : 'pr-3.5'}
              py-2.5
              ${
                error
                  ? 'border-error ring-1 ring-error focus:border-error focus:ring-2 focus:ring-error/20'
                  : 'border-outline-variant/30 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-container-high' : 'hover:border-outline-variant/60'}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-on-surface-variant">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <span className="text-xs font-medium text-error flex items-center gap-1">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-on-surface-variant/80">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
