import { PRIORITY_COLORS } from '@/data/spaces';
import type { Priority } from '@/data/spaces';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export default function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const color = PRIORITY_COLORS[priority] || '#6B7280';

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[12px] font-semibold" style={{ color }}>
        {priority}
      </span>
    </span>
  );
}
