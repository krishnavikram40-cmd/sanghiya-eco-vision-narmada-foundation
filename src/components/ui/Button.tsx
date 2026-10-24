import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'      // गहरा हरा (Emerald)
  | 'secondary'    // नर्मदा नीला (Narmada Blue)
  | 'gold'         // सुनहरा (Auspicious Gold)
  | 'outline'      // बॉर्डर शैली
  | 'danger'       // लाल (अस्वीकृत / हटाना)
  | 'ghost';       // पारदर्शी

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl shadow-md',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm hover:shadow-md border border-emerald-900/30',
    secondary:
      'bg-[#1c3f60] hover:bg-[#15314b] text-white shadow-sm hover:shadow-md border border-[#1c3f60]/40',
    gold:
      'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-sm hover:shadow-md border border-amber-400',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-2xs',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-red-700',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText || 'प्रतीक्षा करें...'}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
