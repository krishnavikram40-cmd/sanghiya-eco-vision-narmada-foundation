import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  hoverEffect = false,
}) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden ${
        hoverEffect ? 'hover:shadow-md hover:border-emerald-200 transition-all' : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div
          className={`p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 ${headerClassName}`}
        >
          <div>
            {title && (
              <h3 className="font-heading font-bold text-slate-900 text-lg sm:text-xl">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className={`p-5 sm:p-6 ${bodyClassName}`}>{children}</div>

      {footer && (
        <div
          className={`p-4 sm:p-5 bg-slate-50 border-t border-slate-100 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
