import React from 'react';
import { VerificationStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  Inbox,
  AlertTriangle,
  XCircle,
  PauseCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'सत्यापित':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: <CheckCircle2 className="shrink-0" />,
          label: 'सत्यापित',
        };
      case 'समीक्षा में':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <Clock className="shrink-0" />,
          label: 'समीक्षा में',
        };
      case 'आवेदन प्राप्त':
        return {
          bg: 'bg-sky-100 text-sky-900 border-sky-300',
          icon: <Inbox className="shrink-0" />,
          label: 'आवेदन प्राप्त',
        };
      case 'अतिरिक्त जानकारी आवश्यक':
        return {
          bg: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: <AlertTriangle className="shrink-0" />,
          label: 'अतिरिक्त जानकारी आवश्यक',
        };
      case 'अस्वीकृत':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: <XCircle className="shrink-0" />,
          label: 'अस्वीकृत',
        };
      case 'निष्क्रिय':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <PauseCircle className="shrink-0" />,
          label: 'निष्क्रिय',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <Clock className="shrink-0" />,
          label: status,
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs select-none ${config.bg} ${sizeClasses} ${className}`}
    >
      {showIcon && React.cloneElement(config.icon, { className: `${iconSizes} ${config.icon.props.className || ''}` })}
      <span>{config.label}</span>
    </span>
  );
};
