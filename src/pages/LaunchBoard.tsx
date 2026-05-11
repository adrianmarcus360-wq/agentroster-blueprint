import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XCircle,
  Clock,
  Rocket,
  CheckCircle2,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  GripVertical,
  AlertCircle,
} from 'lucide-react';
import { spaces, STATUS_COLORS } from '@/data/spaces';
import type { ProductSpace, StatusEnum, LaunchPhase, Priority } from '@/data/spaces';
import PhaseBadge from '@/components/PhaseBadge';
import PriorityBadge from '@/components/PriorityBadge';
import StatusBadge from '@/components/StatusBadge';

// ── Types ─────────────────────────────────────────────────────────

type ColumnKey = 'blocked' | 'in-progress' | 'launch-ready' | 'shipped' | 'post-launch';

interface ColumnDef {
  key: ColumnKey;
  label: string;
  icon: React.ElementType;
  color: string;
  matches: (space: ProductSpace) => boolean;
}

// ── Column Definitions ────────────────────────────────────────────

const isBlocked = (s: ProductSpace) =>
  s.designStatus === 'Blocked' ||
  s.devStatus === 'Blocked' ||
  s.dataStatus === 'Blocked' ||
  s.marketingStatus === 'Blocked' ||
  s.launchStatus === 'Blocked';

const isInProgress = (s: ProductSpace) =>
  !isBlocked(s) &&
  !isLaunchReady(s) &&
  !isShipped(s) &&
  !isPostLaunch(s);

const isLaunchReady = (s: ProductSpace) => s.launchStatus === 'Launch Ready';
const isShipped = (s: ProductSpace) => s.launchStatus === 'Shipped';
const isPostLaunch = (s: ProductSpace) => s.launchStatus === 'Post-Launch Iteration';

const columns: ColumnDef[] = [
  {
    key: 'blocked',
    label: 'Blocked',
    icon: XCircle,
    color: STATUS_COLORS['Blocked'],
    matches: isBlocked,
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    icon: Clock,
    color: STATUS_COLORS['In Development'],
    matches: isInProgress,
  },
  {
    key: 'launch-ready',
    label: 'Launch Ready',
    icon: Rocket,
    color: STATUS_COLORS['Launch Ready'],
    matches: isLaunchReady,
  },
  {
    key: 'shipped',
    label: 'Shipped',
    icon: CheckCircle2,
    color: STATUS_COLORS['Shipped'],
    matches: isShipped,
  },
  {
    key: 'post-launch',
    label: 'Post-Launch',
    icon: RefreshCw,
    color: STATUS_COLORS['Post-Launch Iteration'],
    matches: isPostLaunch,
  },
];

// ── Easing ────────────────────────────────────────────────────────

const entranceEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Kanban Card Component ─────────────────────────────────────────

function KanbanCard({
  space,
  columnColor,
  index,
}: {
  space: ProductSpace;
  columnColor: string;
  index: number;
}) {
  const navigate = useNavigate();

  const statusDots: { label: string; status: StatusEnum }[] = [
    { label: 'Design', status: space.designStatus },
    { label: 'Dev', status: space.devStatus },
    { label: 'Data', status: space.dataStatus },
    { label: 'Launch', status: space.launchStatus },
    { label: 'Mktg', status: space.marketingStatus },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.3 + index * 0.04,
        ease: entranceEase,
      }}
      onClick={() => navigate(`/spaces/${space.slug}`)}
      className="bg-white rounded-[10px] border border-[#E2E8F0] p-[14px] cursor-grab
        hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.04)]
        transition-all duration-200 group"
      style={{
        ['--column-color' as string]: columnColor,
      }}
      whileHover={{ borderColor: `${columnColor}66` }}
    >
      {/* Space Name */}
      <h3 className="text-[14px] font-medium text-[#0F172A] mb-2 leading-snug group-hover:text-[#5B8DEF] transition-colors">
        {space.name}
      </h3>

      {/* Meta Row */}
      <div className="flex items-center gap-2 mb-3">
        <PhaseBadge phase={space.phase} />
        <span className="text-[11px] text-[#94A3B8]">{space.owner}</span>
      </div>

      {/* Status Dots */}
      <div className="flex items-center gap-1.5 mb-2">
        {statusDots.map((dot) => (
          <div
            key={dot.label}
            className="flex items-center gap-1"
            title={`${dot.label}: ${dot.status}`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: STATUS_COLORS[dot.status] || '#6B7280' }}
            />
          </div>
        ))}
      </div>

      {/* Priority */}
      <div className="flex items-center justify-between mt-2">
        <PriorityBadge priority={space.priority} />
        <GripVertical size={14} className="text-[#CBD5E1]" />
      </div>
    </motion.div>
  );
}

// ── Table View Component ──────────────────────────────────────────

function TableView({ spaces }: { spaces: ProductSpace[] }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Space
              </th>
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Phase
              </th>
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Owner
              </th>
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Design
              </th>
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Dev
              </th>
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Data
              </th>
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Launch
              </th>
              <th className="text-left text-[12px] font-medium uppercase tracking-[0.04em] text-[#94A3B8] px-4 py-3">
                Priority
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {spaces.map((space, i) => (
                <motion.tr
                  key={space.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => navigate(`/spaces/${space.slug}`)}
                  className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-[14px] font-medium text-[#0F172A]">
                    {space.name}
                  </td>
                  <td className="px-4 py-3">
                    <PhaseBadge phase={space.phase} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#475569]">{space.owner}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={space.designStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={space.devStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={space.dataStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={space.launchStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={space.priority} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ── Main LaunchBoard Component ────────────────────────────────────

export default function LaunchBoard() {
  const [phaseFilter, setPhaseFilter] = useState<LaunchPhase | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  const phaseOptions: (LaunchPhase | 'All')[] = ['All', 'Launch P0', 'Launch P1', 'P2'];

  // Filter spaces
  const filteredSpaces = useMemo(() => {
    return spaces.filter((s) => {
      const phaseMatch = phaseFilter === 'All' || s.phase === phaseFilter;
      const searchMatch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.owner.toLowerCase().includes(searchQuery.toLowerCase());
      return phaseMatch && searchMatch;
    });
  }, [phaseFilter, searchQuery]);

  // Group by column
  const columnSpaces = useMemo(() => {
    const result: Record<ColumnKey, ProductSpace[]> = {
      blocked: [],
      'in-progress': [],
      'launch-ready': [],
      shipped: [],
      'post-launch': [],
    };

    for (const space of filteredSpaces) {
      for (const col of columns) {
        if (col.matches(space)) {
          result[col.key].push(space);
          break;
        }
      }
    }

    // Sort: P0 first, then P1, then P2, then P3
    const priorityOrder: Record<Priority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    for (const key of Object.keys(result) as ColumnKey[]) {
      result[key].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return result;
  }, [filteredSpaces]);

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
          Launch Board
        </h1>
        <p className="text-[14px] text-[#475569]">
          What&apos;s shipping. What&apos;s blocked. What&apos;s next.
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap items-center gap-3 py-4 border-b border-[#E2E8F0]"
      >
        {/* Phase Filter Pills */}
        <div className="flex items-center gap-2">
          {phaseOptions.map((phase) => (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className={`h-8 px-4 rounded-full text-[13px] font-medium border transition-all duration-200 ${
                phaseFilter === phase
                  ? 'bg-[#5B8DEF] text-white border-[#5B8DEF]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              {phase === 'All' ? 'All Phases' : phase}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-[#E2E8F0] mx-1" />

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

        <div className="flex-1" />

        {/* View Toggle */}
        <div className="flex items-center bg-[#F1F5F9] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-medium transition-all ${
              viewMode === 'board'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#475569]'
            }`}
          >
            <LayoutGrid size={14} />
            Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-[#0F172A] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#475569]'
            }`}
          >
            <List size={14} />
            List
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'board' ? (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            {/* Kanban Board - Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
              {columns.map((col, colIndex) => {
                const colSpaces = columnSpaces[col.key];
                const Icon = col.icon;

                return (
                  <motion.div
                    key={col.key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + colIndex * 0.06,
                      ease: entranceEase,
                    }}
                    className="flex-shrink-0 w-[300px] lg:w-[280px] xl:w-[300px] rounded-xl overflow-hidden"
                    style={{ backgroundColor: `${col.color}05` }}
                  >
                    {/* Column Header */}
                    <div
                      className="flex items-center gap-2 h-12 px-3 border-b-2"
                      style={{ borderColor: col.color }}
                    >
                      <Icon size={16} style={{ color: col.color }} />
                      <span className="text-[14px] font-semibold text-[#0F172A]">
                        {col.label}
                      </span>
                      <span className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-[#F1F5F9] text-[12px] font-medium text-[#94A3B8]">
                        {colSpaces.length}
                      </span>
                    </div>

                    {/* Column Body */}
                    <div className="p-3 space-y-3 min-h-[120px]">
                      {colSpaces.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          {col.key === 'blocked' ? (
                            <>
                              <CheckCircle2 size={24} className="text-[#22C55E] mb-2" />
                              <p className="text-[13px] text-[#94A3B8]">Nothing blocked!</p>
                            </>
                          ) : (
                            <p className="text-[12px] text-[#CBD5E1]">No items</p>
                          )}
                        </div>
                      ) : (
                        colSpaces.map((space, cardIndex) => (
                          <KanbanCard
                            key={space.id}
                            space={space}
                            columnColor={col.color}
                            index={cardIndex}
                          />
                        ))
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            {filteredSpaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle size={32} className="text-[#CBD5E1] mb-3" />
                <p className="text-[14px] text-[#94A3B8]">No spaces match your filters.</p>
              </div>
            ) : (
              <TableView spaces={filteredSpaces} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
