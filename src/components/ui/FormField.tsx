import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs sm:text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="text-red-600 ml-1 font-bold">*</span>}
      </label>
      {children}
      {helperText && !error && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
