import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PhaseBadge from './PhaseBadge';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import type { ProductSpace } from '@/data/spaces';

interface ProductSpaceCardProps {
  space: ProductSpace;
  variant?: 'default' | 'compact';
  index?: number;
}

export default function ProductSpaceCard({ space, variant = 'default', index = 0 }: ProductSpaceCardProps) {
  const navigate = useNavigate();

  const statusFields: { key: 'designStatus' | 'devStatus' | 'dataStatus' | 'marketingStatus'; label: string }[] = [
    { key: 'designStatus', label: 'Design' },
    { key: 'devStatus', label: 'Dev' },
    { key: 'dataStatus', label: 'Data' },
    { key: 'marketingStatus', label: 'Marketing' },
  ];

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        onClick={() => navigate(`/spaces/${space.slug}`)}
        className="min-w-[280px] max-w-[280px] bg-white rounded-xl border border-[#E2E8F0] shadow-card p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-[#5B8DEF]/30 flex-shrink-0"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[14px] font-semibold text-[#0F172A] leading-tight truncate pr-2">
            {space.name}
          </h3>
          <PhaseBadge phase={space.phase} />
        </div>
        <div className="mb-3">
          <StatusBadge status={space.designStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#475569]">{space.owner}</span>
          <PriorityBadge priority={space.priority} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      onClick={() => navigate(`/spaces/${space.slug}`)}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-card p-5 cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-[#5B8DEF]/30"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[16px] font-semibold text-[#0F172A] leading-tight pr-2">
          {space.name}
        </h3>
        <PhaseBadge phase={space.phase} />
      </div>

      {/* Type Label */}
      <p className="text-[12px] text-[#475569] uppercase tracking-[0.04em] mb-3">
        {space.type}
      </p>

      {/* Status Row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {statusFields.map((field) => (
          <StatusBadge key={field.key} status={space[field.key]} />
        ))}
      </div>

      {/* Footer Row */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[10px] font-medium text-[#475569]">
            {space.owner === 'TBD' ? '?' : space.owner.charAt(0)}
          </div>
          <span className="text-[12px] text-[#475569]">{space.owner}</span>
        </div>
        <PriorityBadge priority={space.priority} />
      </div>
    </motion.div>
  );
}
