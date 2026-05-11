import { STATUS_COLORS } from '@/data/spaces';
import type { StatusEnum } from '@/data/spaces';

interface StatusBadgeProps {
  status: StatusEnum;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] || '#6B7280';

  return (
    <span
      className={`inline-flex items-center h-[22px] px-[10px] rounded-full text-[11px] font-medium uppercase tracking-[0.04em] border ${className}`}
      style={{
        backgroundColor: `${color}1F`, // ~12% opacity
        color: color,
        borderColor: `${color}40`, // ~25% opacity
      }}
    >
      {status}
    </span>
  );
}
