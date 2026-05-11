import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  List,
  Search,
  SearchX,
  X,
  ChevronDown,
} from 'lucide-react';
import ProductSpaceCard from '@/components/ProductSpaceCard';
import PhaseBadge from '@/components/PhaseBadge';
import PriorityBadge from '@/components/PriorityBadge';
import {
  spaces,
  STATUS_COLORS,
  type ProductSpace,
  type StatusEnum,
  type Priority,
  type LaunchPhase,
} from '@/data/spaces';

// ── Constants ────────────────────────────────────────────────────

const PHASES: (LaunchPhase | 'All')[] = [
  'All',
  'Launch P0',
  'Launch P1',
  'P2',
  'Coming Soon',
];

const PRIORITY_OPTIONS: Priority[] = ['P0', 'P1', 'P2', 'P3'];

const STATUS_CATEGORIES = [
  { label: 'Spec', statuses: ['Idea', 'Spec Needed', 'Spec Ready'] as StatusEnum[] },
  { label: 'Design', statuses: ['Design Needed', 'Design In Progress', 'Wireframe Ready', 'Prototype Ready'] as StatusEnum[] },
  { label: 'Dev', statuses: ['Dev Ready', 'In Development', 'QA', 'Launch Ready'] as StatusEnum[] },
  { label: 'Live', statuses: ['Shipped', 'Post-Launch Iteration'] as StatusEnum[] },
  { label: 'Blocked', statuses: ['Blocked'] as StatusEnum[] },
];

// ── Animation Variants ───────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Sub-components ───────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center h-8 px-3.5 rounded-full text-[13px] font-medium
        border transition-all duration-200 cursor-pointer whitespace-nowrap
        ${active
          ? 'bg-[#5B8DEF] text-white border-[#5B8DEF]'
          : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
        }
      `}
    >
      {label}
    </button>
  );
}

function StatusDot({ status }: { status: StatusEnum }) {
  const color = STATUS_COLORS[status] || '#6B7280';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[11px] font-medium" style={{ color }}>
        {status}
      </span>
    </span>
  );
}

function DropdownCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-[#F1F5F9] rounded-md transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded border-[#CBD5E1] accent-[#5B8DEF]"
      />
      <span className="text-[13px] text-[#475569] flex-1">{label}</span>
    </label>
  );
}

function FilterDropdown({
  label,
  children,
  activeCount,
}: {
  label: string;
  children: React.ReactNode;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        className={`
          inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-medium
          border transition-all duration-200 cursor-pointer whitespace-nowrap
          ${activeCount > 0
            ? 'bg-[#EFF6FF] text-[#5B8DEF] border-[#5B8DEF]/30'
            : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
          }
        `}
      >
        {label}
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#5B8DEF] text-white text-[10px] font-semibold">
            {activeCount}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl border border-[#E2E8F0] shadow-dropdown p-2 min-w-[220px] z-50">
          {children}
        </div>
      )}
    </div>
  );
}

function ActiveFilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[#EFF6FF] border border-[#5B8DEF]/20 text-[12px] font-medium text-[#5B8DEF]">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
      >
        <X size={12} />
      </button>
    </span>
  );
}

function DataRow({ space, index }: { space: ProductSpace; index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      onClick={() => { window.location.hash = `#/spaces/${space.slug}`; }}
      className="flex items-center gap-4 h-14 px-4 border-b border-[#E2E8F0] cursor-pointer hover:bg-[#F1F5F9] transition-colors duration-100"
    >
      {/* Name */}
      <div className="flex-1 min-w-0">
        <span className="text-[14px] font-medium text-[#0F172A] truncate block">
          {space.name}
        </span>
      </div>
      {/* Phase */}
      <div className="w-[100px] flex-shrink-0">
        <PhaseBadge phase={space.phase} />
      </div>
      {/* Priority */}
      <div className="w-[50px] flex-shrink-0">
        <PriorityBadge priority={space.priority} />
      </div>
      {/* Design */}
      <div className="w-[120px] flex-shrink-0 hidden md:block">
        <StatusDot status={space.designStatus} />
      </div>
      {/* Dev */}
      <div className="w-[120px] flex-shrink-0 hidden md:block">
        <StatusDot status={space.devStatus} />
      </div>
      {/* Data */}
      <div className="w-[100px] flex-shrink-0 hidden lg:block">
        <StatusDot status={space.dataStatus} />
      </div>
      {/* Marketing */}
      <div className="w-[100px] flex-shrink-0 hidden lg:block">
        <StatusDot status={space.marketingStatus} />
      </div>
      {/* Owner */}
      <div className="w-[80px] flex-shrink-0 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[9px] font-medium text-[#475569]">
          {space.owner === 'TBD' ? '?' : space.owner.charAt(0)}
        </div>
        <span className="text-[12px] text-[#475569] truncate">{space.owner}</span>
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function SpacesDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();

  const view = (searchParams.get('view') || 'grid') as 'grid' | 'list';

  const [activePhase, setActivePhase] = useState<LaunchPhase | 'All'>('All');
  const [activeStatuses, setActiveStatuses] = useState<Set<StatusEnum>>(new Set());
  const [activePriorities, setActivePriorities] = useState<Set<Priority>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const setView = useCallback(
    (v: 'grid' | 'list') => {
      const sp = new URLSearchParams(searchParams);
      sp.set('view', v);
      setSearchParams(sp);
    },
    [searchParams, setSearchParams]
  );

  const toggleStatus = useCallback((status: StatusEnum) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }, []);

  const togglePriority = useCallback((priority: Priority) => {
    setActivePriorities((prev) => {
      const next = new Set(prev);
      if (next.has(priority)) next.delete(priority);
      else next.add(priority);
      return next;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActivePhase('All');
    setActiveStatuses(new Set());
    setActivePriorities(new Set());
    setSearchQuery('');
  }, []);

  // ── Filtering ──────────────────────────────────────────────────

  const filteredSpaces = useMemo(() => {
    return spaces.filter((space: ProductSpace) => {
      if (activePhase !== 'All' && space.phase !== activePhase) return false;

      if (activeStatuses.size > 0) {
        const spaceStatuses = [
          space.designStatus,
          space.devStatus,
          space.dataStatus,
          space.marketingStatus,
          space.launchStatus,
        ];
        const hasMatch = spaceStatuses.some((s) => activeStatuses.has(s));
        if (!hasMatch) return false;
      }

      if (activePriorities.size > 0 && !activePriorities.has(space.priority)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          space.name.toLowerCase().includes(q) ||
          space.type.toLowerCase().includes(q) ||
          space.owner.toLowerCase().includes(q) ||
          space.purpose.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [activePhase, activeStatuses, activePriorities, searchQuery]);

  // ── Active Filter Tags ─────────────────────────────────────────

  const activeTags: { label: string; onRemove: () => void }[] = [];
  if (activePhase !== 'All') {
    activeTags.push({ label: activePhase, onRemove: () => setActivePhase('All') });
  }
  activeStatuses.forEach((s) => {
    activeTags.push({ label: s, onRemove: () => toggleStatus(s) });
  });
  activePriorities.forEach((p) => {
    activeTags.push({ label: `Priority: ${p}`, onRemove: () => togglePriority(p) });
  });
  if (searchQuery.trim()) {
    activeTags.push({
      label: `Search: "${searchQuery}"`,
      onRemove: () => setSearchQuery(''),
    });
  }

  const totalCount = spaces.length;
  const filteredCount = filteredSpaces.length;

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="pb-6 border-b border-[#E2E8F0] mb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#0F172A]">
              {filteredCount === totalCount
                ? `${totalCount} Product Spaces`
                : `${filteredCount} of ${totalCount} Product Spaces`}
            </h1>
            <p className="text-[14px] text-[#475569] mt-1">
              Every surface of the AgentRoster platform
            </p>
          </div>
          {/* View Toggle */}
          <div className="flex items-center bg-white rounded-lg border border-[#E2E8F0] p-0.5 flex-shrink-0">
            <button
              onClick={() => setView('grid')}
              className={`
                flex items-center justify-center w-9 h-8 rounded-md transition-all duration-200 cursor-pointer
                ${view === 'grid' ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#94A3B8] hover:text-[#475569]'}
              `}
              title="Grid view"
            >
              <LayoutDashboard size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`
                flex items-center justify-center w-9 h-8 rounded-md transition-all duration-200 cursor-pointer
                ${view === 'list' ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#94A3B8] hover:text-[#475569]'}
              `}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: EASE }}
        className="mb-6"
      >
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          {/* Phase Pills */}
          {PHASES.map((phase) => (
            <FilterPill
              key={phase}
              label={phase === 'All' ? 'All' : phase}
              active={activePhase === phase}
              onClick={() => setActivePhase(phase)}
            />
          ))}

          <div className="w-px h-6 bg-[#E2E8F0] mx-1 hidden sm:block" />

          {/* Status Dropdown */}
          <FilterDropdown label="Status" activeCount={activeStatuses.size}>
            <div className="max-h-[320px] overflow-y-auto">
              {STATUS_CATEGORIES.map((cat) => (
                <div key={cat.label} className="mb-1">
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">
                    {cat.label}
                  </div>
                  {cat.statuses.map((s) => (
                    <DropdownCheck
                      key={s}
                      label={s}
                      checked={activeStatuses.has(s)}
                      onChange={() => toggleStatus(s)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </FilterDropdown>

          {/* Priority Dropdown */}
          <FilterDropdown label="Priority" activeCount={activePriorities.size}>
            <div className="p-1">
              {PRIORITY_OPTIONS.map((p) => (
                <DropdownCheck
                  key={p}
                  label={p}
                  checked={activePriorities.has(p)}
                  onChange={() => togglePriority(p)}
                />
              ))}
            </div>
          </FilterDropdown>

          <div className="flex-1 min-w-[8px]" />

          {/* Search */}
          <div className="relative w-full sm:w-[240px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        <AnimatePresence>
          {activeTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 pt-3"
            >
              {activeTags.map((tag, i) => (
                <ActiveFilterTag
                  key={`${tag.label}-${i}`}
                  label={tag.label}
                  onRemove={tag.onRemove}
                />
              ))}
              {activeTags.length >= 2 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[12px] font-medium text-[#5B8DEF] hover:underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      {filteredCount === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col items-center justify-center py-20"
        >
          <SearchX size={48} className="text-[#94A3B8] mb-4" />
          <p className="text-[16px] font-medium text-[#475569] mb-1">
            No spaces match your filters
          </p>
          <p className="text-[13px] text-[#94A3B8] mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={clearAllFilters}
            className="h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </motion.div>
      ) : view === 'grid' ? (
        /* Grid View */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        >
          {filteredSpaces.map((space, index) => (
            <motion.div key={space.id} variants={cardVariants}>
              <ProductSpaceCard space={space} index={index} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* List View */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden"
        >
          {/* List Header */}
          <div className="flex items-center gap-4 h-10 px-4 border-b-2 border-[#E2E8F0]">
            <span className="flex-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8]">Name</span>
            <span className="w-[100px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] flex-shrink-0">Phase</span>
            <span className="w-[50px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] flex-shrink-0">Priority</span>
            <span className="w-[120px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] flex-shrink-0 hidden md:block">Design</span>
            <span className="w-[120px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] flex-shrink-0 hidden md:block">Dev</span>
            <span className="w-[100px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] flex-shrink-0 hidden lg:block">Data</span>
            <span className="w-[100px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] flex-shrink-0 hidden lg:block">Marketing</span>
            <span className="w-[80px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] flex-shrink-0">Owner</span>
          </div>
          {/* List Rows */}
          {filteredSpaces.map((space, index) => (
            <DataRow key={space.id} space={space} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
