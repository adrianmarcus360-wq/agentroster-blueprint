import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Image,
  Layout,
  Play,
  ExternalLink,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { spaces, STATUS_COLORS } from '@/data/spaces';
import type { ProductSpace, StatusEnum, LaunchPhase } from '@/data/spaces';
import PhaseBadge from '@/components/PhaseBadge';
import PriorityBadge from '@/components/PriorityBadge';
import StatusBadge from '@/components/StatusBadge';

// ── Design Pipeline Steps ─────────────────────────────────────────

const DESIGN_STEPS: StatusEnum[] = [
  'Design Needed',
  'Design In Progress',
  'Wireframe Ready',
  'Prototype Ready',
  'Dev Ready',
  'Shipped',
];

const STEP_COLORS = [
  '#F59E0B', // Design Needed - amber
  '#3B82F6', // Design In Progress - blue
  '#8B5CF6', // Wireframe Ready - purple
  '#A78BFA', // Prototype Ready - light purple
  '#06B6D4', // Dev Ready - cyan
  '#22C55E', // Shipped - green
];

function getDesignStepIndex(status: StatusEnum): number {
  const index = DESIGN_STEPS.indexOf(status);
  return index >= 0 ? index : 0;
}

function isDesignComplete(status: StatusEnum): boolean {
  return status === 'Prototype Ready' || status === 'Dev Ready' || status === 'Shipped';
}

// ── Easing ────────────────────────────────────────────────────────

const entranceEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Progress Ring Component ───────────────────────────────────────

function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#5B8DEF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[20px] font-bold text-[#0F172A]"
        >
          {percentage}%
        </motion.span>
        <span className="text-[11px] text-[#94A3B8]">Complete</span>
      </div>
    </div>
  );
}

// ── Design Pipeline Bar ───────────────────────────────────────────

function DesignPipelineBar({ currentStatus }: { currentStatus: StatusEnum }) {
  const currentIndex = getDesignStepIndex(currentStatus);

  return (
    <div className="space-y-2">
      {/* Segmented Progress */}
      <div className="flex gap-[2px]">
        {DESIGN_STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div
              key={step}
              className="flex-1 h-2 rounded-sm transition-all duration-300"
              style={{
                backgroundColor: isCompleted
                  ? '#5B8DEF'
                  : isCurrent
                    ? '#5B8DEF'
                    : '#E2E8F0',
                opacity: isCurrent ? 1 : isCompleted ? 0.8 : 1,
              }}
              title={step}
            >
              {isCurrent && (
                <motion.div
                  className="h-full rounded-sm bg-[#5B8DEF]"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between">
        {DESIGN_STEPS.map((step, i) => {
          const isActive = i <= currentIndex;
          return (
            <span
              key={step}
              className="text-[10px] font-medium uppercase tracking-[0.02em] flex-1 text-center"
              style={{
                color: isActive ? STEP_COLORS[i] : '#CBD5E1',
              }}
            >
              {step.split(' ').slice(0, 2).join(' ')}
            </span>
          );
        })}
      </div>

      {/* Current Step Label */}
      <p className="text-[12px] text-[#475569] text-center pt-1">
        Current: <span className="font-medium" style={{ color: STEP_COLORS[currentIndex] }}>{currentStatus}</span>
      </p>
    </div>
  );
}

// ── Design Card Component ─────────────────────────────────────────

function DesignCard({
  space,
  index,
}: {
  space: ProductSpace;
  index: number;
}) {
  const navigate = useNavigate();
  const designStepIndex = getDesignStepIndex(space.designStatus);
  const progressPercent = Math.round(((designStepIndex + 1) / DESIGN_STEPS.length) * 100);
  const hasBlankSlots = space.designStatus === 'Design Needed';

  // Mock artifact data based on design status
  const mockupCount = designStepIndex >= 2 ? Math.floor(Math.random() * 3) + 1 : 0;
  const wireframeCount = designStepIndex >= 1 ? Math.floor(Math.random() * 2) + 1 : 0;
  const hasPrototype = designStepIndex >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.4 + index * 0.06,
        ease: entranceEase,
      }}
      className={`bg-white rounded-xl border border-[#E2E8F0] p-5
        hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.04)]
        transition-all duration-200 cursor-pointer group`}
      style={{
        borderLeftWidth: hasBlankSlots ? '3px' : '1px',
        borderLeftColor: hasBlankSlots ? '#FFB347' : undefined,
      }}
      onClick={() => navigate(`/spaces/${space.slug}`)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <PhaseBadge phase={space.phase} />
        <PriorityBadge priority={space.priority} />
      </div>

      {/* Space Name */}
      <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1 group-hover:text-[#5B8DEF] transition-colors leading-snug">
        {space.name}
      </h3>

      {/* Owner */}
      <p className="text-[12px] text-[#94A3B8] mb-4">{space.owner}</p>

      {/* Status Panel */}
      <div className="bg-[#F1F5F9] rounded-lg p-4 mb-4 space-y-3">
        {/* Design Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#475569] font-medium">Design Status</span>
          <StatusBadge status={space.designStatus} />
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#94A3B8]">Progress</span>
            <span className="text-[11px] font-medium text-[#475569]">{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#5B8DEF] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.06, ease: entranceEase }}
            />
          </div>
        </div>

        {/* Design Pipeline */}
        <DesignPipelineBar currentStatus={space.designStatus} />

        {/* Artifacts */}
        <div className="space-y-1.5 pt-1">
          <ArtifactRow icon={Image} label="Mockups" count={mockupCount} />
          <ArtifactRow icon={Layout} label="Wireframes" count={wireframeCount} />
          <ArtifactRow icon={Play} label="Prototype" count={hasPrototype ? 1 : 0} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/spaces/${space.slug}`);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-[#E2E8F0]
              text-[12px] font-medium text-[#475569] hover:bg-white hover:border-[#CBD5E1] transition-all"
          >
            <Eye size={14} />
            View Space
          </button>
          {mockupCount > 0 && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg
                bg-[#5B8DEF] text-white text-[12px] font-medium hover:bg-[#4a7de0] transition-all"
            >
              Open Mockups
              <ExternalLink size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Blank Slots Callout */}
      {hasBlankSlots && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[#FFB34708] border-l-[3px] border-[#FFB347]">
          <AlertCircle size={14} className="text-[#FFB347] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[12px] font-medium text-[#FFB347]">Design Needed</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              No design assets started yet. This space needs design attention.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Artifact Row ──────────────────────────────────────────────────

function ArtifactRow({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-[#94A3B8]" />
      <span className="text-[12px] text-[#475569] flex-1">{label}</span>
      {count > 0 ? (
        <span className="text-[12px] font-medium text-[#5B8DEF]">
          {count} linked
        </span>
      ) : (
        <span className="text-[12px] text-[#94A3B8]">&mdash;</span>
      )}
    </div>
  );
}

// ── Status Breakdown Pill ─────────────────────────────────────────

function StatusPill({
  label,
  count,
  color,
  delay,
}: {
  label: string;
  count: number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: entranceEase }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
      style={{
        backgroundColor: `${color}1A`,
        borderColor: `${color}40`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[13px] font-medium" style={{ color }}>
        {label}
      </span>
      <span className="text-[12px] font-semibold text-[#0F172A] ml-1">
        {count}
      </span>
    </motion.div>
  );
}

// ── Main DesignBoard Component ────────────────────────────────────

export default function DesignBoard() {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [phaseFilter, setPhaseFilter] = useState<LaunchPhase | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statusFilters: { label: string; value: string; color?: string }[] = [
    { label: 'All', value: 'All' },
    { label: 'Design Needed', value: 'Design Needed', color: STATUS_COLORS['Design Needed'] },
    { label: 'In Progress', value: 'Design In Progress', color: STATUS_COLORS['Design In Progress'] },
    { label: 'Wireframe Ready', value: 'Wireframe Ready', color: STATUS_COLORS['Wireframe Ready'] },
    { label: 'Prototype Ready', value: 'Prototype Ready', color: STATUS_COLORS['Prototype Ready'] },
  ];

  const phaseOptions: (LaunchPhase | 'All')[] = ['All', 'Launch P0', 'Launch P1', 'P2'];

  // Calculations
  const totalSpaces = spaces.length;
  const designCompleteCount = spaces.filter((s) => isDesignComplete(s.designStatus)).length;
  const completionPercent = Math.round((designCompleteCount / totalSpaces) * 100);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of spaces) {
      counts[s.designStatus] = (counts[s.designStatus] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter spaces
  const filteredSpaces = useMemo(() => {
    return spaces.filter((s) => {
      const statusMatch =
        statusFilter === 'All' || s.designStatus === statusFilter;
      const phaseMatch = phaseFilter === 'All' || s.phase === phaseFilter;
      const searchMatch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && phaseMatch && searchMatch;
    });
  }, [statusFilter, phaseFilter, searchQuery]);

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: entranceEase }}
        className="pb-6 border-b border-[#E2E8F0]"
      >
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#0F172A] mb-1">
          Design Board
        </h1>
        <p className="text-[14px] text-[#475569]">
          Creative pipeline for all {totalSpaces} spaces
        </p>
      </motion.div>

      {/* Design Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: entranceEase }}
        className="flex flex-wrap items-center gap-6 py-6 border-b border-[#E2E8F0]"
      >
        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <ProgressRing percentage={completionPercent} />
          <div>
            <p className="text-[14px] font-semibold text-[#0F172A]">
              {designCompleteCount} of {totalSpaces} spaces
            </p>
            <p className="text-[13px] text-[#94A3B8]">
              design-complete or beyond
            </p>
          </div>
        </div>

        <div className="w-px h-16 bg-[#E2E8F0] hidden sm:block" />

        {/* Status Breakdown */}
        <div className="flex flex-wrap items-center gap-3">
          {statusFilters.filter((sf): sf is typeof sf & { color: string } => !!sf.color).map((sf, i) => (
            <StatusPill
              key={sf.value}
              label={sf.label}
              count={statusCounts[sf.value] || 0}
              color={sf.color}
              delay={0.2 + i * 0.05}
            />
          ))}
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3, ease: entranceEase }}
        className="flex flex-wrap items-center gap-3 py-4 border-b border-[#E2E8F0]"
      >
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2">
          {statusFilters.map((sf) => (
            <button
              key={sf.value}
              onClick={() => setStatusFilter(sf.value)}
              className={`h-8 px-4 rounded-full text-[13px] font-medium border transition-all duration-200 ${
                statusFilter === sf.value
                  ? 'bg-[#5B8DEF] text-white border-[#5B8DEF]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              {sf.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-[#E2E8F0] mx-1" />

        {/* Phase Filter */}
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value as LaunchPhase | 'All')}
          className="h-8 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#475569]
            bg-white focus:outline-none focus:border-[#5B8DEF] cursor-pointer"
        >
          {phaseOptions.map((p) => (
            <option key={p} value={p}>
              {p === 'All' ? 'All Phases' : p}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-9 pr-4 rounded-lg border border-[#E2E8F0] text-[13px]
              placeholder:text-[#94A3B8] focus:outline-none focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF]
              transition-all"
          />
        </div>
      </motion.div>

      {/* Design Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredSpaces.map((space, i) => (
            <DesignCard key={space.id} space={space} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredSpaces.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <AlertCircle size={32} className="text-[#CBD5E1] mb-3" />
          <p className="text-[14px] text-[#94A3B8]">No spaces match your filters.</p>
        </motion.div>
      )}
    </div>
  );
}
