import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      value,
      className = '',
      containerClassName = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        <div className="flex justify-between items-center">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-xs font-semibold text-on-surface select-none tracking-wide"
            >
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[11px] text-on-surface-variant font-mono">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={`w-full rounded-xl bg-surface-container-low border text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-200 outline-none p-3.5 min-h-[100px] resize-y
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
        {error ? (
          <span className="text-xs font-medium text-error">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-on-surface-variant/80">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
