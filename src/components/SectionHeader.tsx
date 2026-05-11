import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  count?: number;
  viewAllLink?: string;
  viewAllLabel?: string;
  titleColor?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  count,
  viewAllLink,
  viewAllLabel,
  titleColor,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2
            className="text-[20px] font-semibold tracking-[-0.01em]"
            style={{ color: titleColor || 'var(--text-primary)' }}
          >
            {title}
          </h2>
          {count !== undefined && count > 0 && (
            <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
              {count}
            </span>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-0.5 text-[13px] font-medium text-[#5B8DEF] hover:underline transition-colors duration-200"
          >
            {viewAllLabel || 'View all'}
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <div className="h-px bg-[#E2E8F0]" />
    </div>
  );
}
