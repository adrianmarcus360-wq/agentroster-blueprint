import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type AlertVariant = 'error' | 'warning' | 'info' | 'success';

interface InlineAlertProps {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; iconColor: string; defaultIcon: ReactNode }> = {
  error: {
    bg: 'bg-red-500/[0.05]',
    border: 'border-red-500/30',
    iconColor: 'text-[#DC2626]',
    defaultIcon: <XCircle size={16} className="text-[#DC2626]" />,
  },
  warning: {
    bg: 'bg-amber-500/[0.05]',
    border: 'border-amber-500/30',
    iconColor: 'text-[#F59E0B]',
    defaultIcon: <AlertCircle size={16} className="text-[#F59E0B]" />,
  },
  info: {
    bg: 'bg-blue-500/[0.05]',
    border: 'border-blue-500/30',
    iconColor: 'text-[#3B82F6]',
    defaultIcon: <Info size={16} className="text-[#3B82F6]" />,
  },
  success: {
    bg: 'bg-green-500/[0.05]',
    border: 'border-green-500/30',
    iconColor: 'text-[#22C55E]',
    defaultIcon: <CheckCircle2 size={16} className="text-[#22C55E]" />,
  },
};

export default function InlineAlert({ variant, children, className = '', icon }: InlineAlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-lg border
        ${styles.bg} ${styles.border} ${className}
      `}
    >
      <div className="mt-0.5 shrink-0">{icon || styles.defaultIcon}</div>
      <div className="flex-1 text-[13px] font-medium text-[#0F172A]">{children}</div>
    </div>
  );
}
