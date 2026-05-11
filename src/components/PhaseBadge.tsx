import { PHASE_COLORS } from '@/data/spaces';
import type { LaunchPhase } from '@/data/spaces';

interface PhaseBadgeProps {
  phase: LaunchPhase;
  className?: string;
}

export default function PhaseBadge({ phase, className = '' }: PhaseBadgeProps) {
  const colors = PHASE_COLORS[phase] || PHASE_COLORS['Coming Soon'];

  return (
    <span
      className={`inline-flex items-center h-6 px-3 rounded-md text-[11px] font-semibold uppercase tracking-[0.05em] border ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {phase}
    </span>
  );
}
