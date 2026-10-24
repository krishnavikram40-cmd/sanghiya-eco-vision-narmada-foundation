import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from 'lucide-react';

export type AlertType = 'success' | 'warning' | 'info' | 'error';

interface AlertNoticeProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const AlertNotice: React.FC<AlertNoticeProps> = ({
  type,
  title,
  children,
  onClose,
  className = '',
}) => {
  const configs = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      titleColor: 'text-emerald-900',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      titleColor: 'text-amber-900',
    },
    info: {
      bg: 'bg-sky-50 border-sky-300 text-sky-950',
      icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
      titleColor: 'text-sky-900',
    },
    error: {
      bg: 'bg-rose-50 border-rose-300 text-rose-950',
      icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      titleColor: 'text-rose-900',
    },
  }[type];

  return (
    <div
      className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm shadow-2xs ${configs.bg} ${className}`}
      role="alert"
    >
      <div className="mt-0.5">{configs.icon}</div>
      <div className="flex-1 space-y-0.5">
        {title && <div className={`font-bold ${configs.titleColor}`}>{title}</div>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="सूचना बंद करें"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
