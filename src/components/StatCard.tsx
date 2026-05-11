import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  subtext?: string;
  accentColor: string;
  onClick?: () => void;
  className?: string;
  pulse?: boolean;
}

export default function StatCard({
  icon,
  value,
  label,
  subtext,
  accentColor,
  onClick,
  className = '',
  pulse = false,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 600;
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      onClick={onClick}
      className={`
        relative bg-white rounded-xl border border-[#E2E8F0] p-6 overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        transition-shadow duration-200 hover:shadow-card-hover
        ${className}
      `}
      style={{ borderTopWidth: 3, borderTopColor: accentColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div style={{ color: accentColor }}>{icon}</div>
      </div>
      <div className={`text-[36px] font-bold tracking-[-0.02em] text-[#0F172A] mb-1 ${pulse ? 'animate-pulse' : ''}`}>
        {displayValue}
      </div>
      <div className="text-[13px] font-medium text-[#475569] mb-1">{label}</div>
      {subtext && (
        <div className="text-[12px] text-[#94A3B8]">{subtext}</div>
      )}
    </motion.div>
  );
}
