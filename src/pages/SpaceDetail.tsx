import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Users,
  Link2,
  Clock,
  FileText,
  Layout,
  Database,
  Puzzle,
  GitBranch,
  HelpCircle,
  StickyNote,
  Target,
  CheckCircle2,
  Eye,
  Layers,
} from 'lucide-react';
import PhaseBadge from '@/components/PhaseBadge';
import PriorityBadge from '@/components/PriorityBadge';
import StatusBadge from '@/components/StatusBadge';
import {
  getSpaceBySlug,
  spaces,
  STATUS_COLORS,
  type ProductSpace,
  type StatusEnum,
  type DataSource,
} from '@/data/spaces';

// ── Animation ────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: EASE },
  }),
};

// ── Status Pipeline Position (for progress bar) ─────────────────

const STATUS_PIPELINE: StatusEnum[] = [
  'Idea',
  'Spec Needed',
  'Spec Ready',
  'Design Needed',
  'Design In Progress',
  'Wireframe Ready',
  'Prototype Ready',
  'Dev Ready',
  'In Development',
  'QA',
  'Launch Ready',
  'Shipped',
  'Post-Launch Iteration',
  'Blocked',
];

function getStatusProgress(status: StatusEnum): number {
  if (status === 'Blocked') return 0;
  const idx = STATUS_PIPELINE.indexOf(status);
  if (idx === -1) return 50;
  return Math.round(((idx + 1) / STATUS_PIPELINE.length) * 100);
}

// ── DetailSection wrapper ────────────────────────────────────────

function DetailSection({
  title,
  icon,
  count,
  countAmber,
  children,
  animationIndex,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  countAmber?: boolean;
  children: React.ReactNode;
  animationIndex: number;
}) {
  return (
    <motion.div
      custom={animationIndex}
      variants={sectionVariants}
      initial="hidden"
      animate="show"
      className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#475569]">{icon}</span>
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#0F172A]">
          {title}
        </h2>
        {count !== undefined && count > 0 && (
          <span
            className={`inline-flex items-center h-5 px-2 rounded-full text-[11px] font-medium ${
              countAmber
                ? 'bg-[#FFB347]/15 text-[#FFB347]'
                : 'bg-[#F1F5F9] text-[#475569]'
            }`}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// ── OpenQuestionCard ─────────────────────────────────────────────

function OpenQuestionCard({
  question,
  context,
  status,
  priority,
}: {
  question: string;
  context: string;
  status: 'Open' | 'In Review' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
}) {
  const priorityColors = {
    High: '#DC2626',
    Medium: '#F59E0B',
    Low: '#6B7280',
  };
  const statusColors = {
    Open: '#F59E0B',
    'In Review': '#3B82F6',
    Resolved: '#22C55E',
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-[#E2E8F0] border-l-[3px] border-l-[#FFB347] hover:bg-[#F1F5F9] transition-colors">
      <p className="text-[14px] font-medium text-[#0F172A] mb-1">{question}</p>
      <p className="text-[12px] text-[#475569] mb-3 line-clamp-2">{context}</p>
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.04em]"
          style={{
            backgroundColor: `${priorityColors[priority]}1F`,
            color: priorityColors[priority],
          }}
        >
          {priority}
        </span>
        <span
          className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.04em]"
          style={{
            backgroundColor: `${statusColors[status]}1F`,
            color: statusColors[status],
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

// ── ProgressBar ──────────────────────────────────────────────────

function ProgressBar({ status }: { status: StatusEnum }) {
  const progress = getStatusProgress(status);
  const color = STATUS_COLORS[status] || '#6B7280';

  return (
    <div className="mt-1.5">
      <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Breadcrumbs ──────────────────────────────────────────────────

function Breadcrumbs({ spaceName }: { spaceName: string }) {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1.5 text-[12px] text-[#94A3B8] mb-4"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#5B8DEF] transition-colors"
      >
        <Home size={12} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      <ChevronRight size={12} />
      <Link
        to="/spaces"
        className="hover:text-[#5B8DEF] transition-colors"
      >
        Spaces
      </Link>
      <ChevronRight size={12} />
      <span className="text-[#475569] font-medium truncate max-w-[200px] sm:max-w-[300px]">
        {spaceName}
      </span>
    </motion.nav>
  );
}

// ── Status Summary ───────────────────────────────────────────────

function StatusSummary({ space }: { space: ProductSpace }) {
  const statuses = [
    space.designStatus,
    space.devStatus,
    space.dataStatus,
    space.marketingStatus,
    space.launchStatus,
  ];
  const blocked = statuses.some((s) => s === 'Blocked');
  const complete = statuses.every((s) => s === 'Shipped' || s === 'Post-Launch Iteration');
  const aligned = new Set(statuses).size === 1;

  if (blocked) {
    return (
      <p className="text-[13px] font-medium text-[#DC2626] mt-4">
        This space is currently blocked. See Open Questions for details.
      </p>
    );
  }
  if (complete) {
    return (
      <p className="text-[13px] font-medium text-[#22C55E] mt-4">
        All systems aligned. On track for {space.phase}.
      </p>
    );
  }
  if (aligned) {
    return (
      <p className="text-[13px] font-medium text-[#22C55E] mt-4">
        All systems aligned. On track for {space.phase}.
      </p>
    );
  }
  return (
    <p className="text-[13px] font-medium text-[#F59E0B] mt-4">
      Statuses vary across workstreams. Review individual status badges above.
    </p>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function SpaceDetail() {
  const { slug } = useParams<{ slug: string }>();

  const space = useMemo(() => getSpaceBySlug(slug || ''), [slug]);

  // Resolve dependencies
  const upstreamSpaces = useMemo(() => {
    if (!space) return [];
    return space.dependencies
      .map((depId) => {
        const depStr = typeof depId === 'number' ? depId.toString() : depId;
        return spaces.find((s) => s.id === depStr);
      })
      .filter(Boolean) as ProductSpace[];
  }, [space]);

  const downstreamSpaces = useMemo(() => {
    if (!space) return [];
    return spaces.filter((s) =>
      s.dependencies.some((d) => {
        const dStr = typeof d === 'number' ? d.toString() : d;
        return dStr === space.id;
      })
    );
  }, [space]);

  // Not found state
  if (!space) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col items-center justify-center py-20"
      >
        <HelpCircle size={48} className="text-[#94A3B8] mb-4" />
        <h1 className="text-[20px] font-semibold text-[#0F172A] mb-2">
          Space not found
        </h1>
        <p className="text-[14px] text-[#475569] mb-6">
          The space you're looking for doesn't exist.
        </p>
        <Link
          to="/spaces"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#5B8DEF] text-white text-[13px] font-medium hover:bg-[#4A7DE4] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Spaces
        </Link>
      </motion.div>
    );
  }

  // Format data sources
  const dataSources: (string | DataSource)[] = space.dataSources;

  // Open questions count
  const openQuestionCount = space.openQuestions.filter(
    (q) => q.status === 'Open'
  ).length;

  return (
    <div className="max-w-[960px]">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <Link
          to="/spaces"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B8DEF] hover:underline transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Spaces
        </Link>
      </motion.div>

      {/* Breadcrumbs */}
      <Breadcrumbs spaceName={space.name} />

      {/* ── Space Header ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 mb-6"
      >
        {/* Top row: Phase + Priority */}
        <div className="flex items-start justify-between mb-3">
          <PhaseBadge phase={space.phase} />
          <PriorityBadge priority={space.priority} />
        </div>

        {/* Space Name */}
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-[#0F172A] leading-tight">
          {space.name}
        </h1>

        {/* Type */}
        <p className="text-[12px] text-[#475569] uppercase tracking-[0.04em] mt-1.5">
          {space.type}
        </p>

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
          {/* Owner */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[11px] font-medium text-[#475569]">
              {space.owner === 'TBD' ? '?' : space.owner.charAt(0)}
            </div>
            <span className="text-[14px] text-[#0F172A]">{space.owner}</span>
          </div>
          {/* Route */}
          <div className="flex items-center gap-1.5">
            <Link2 size={14} className="text-[#94A3B8]" />
            <span className="text-[13px] font-mono text-[#5B8DEF]">
              {space.route}
            </span>
          </div>
          {/* Last Updated placeholder */}
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#94A3B8]" />
            <span className="text-[12px] text-[#94A3B8]">Recently updated</span>
          </div>
        </div>
      </motion.div>

      {/* ── Purpose & Promise ──────────────────────────────────── */}
      <DetailSection
        title="Purpose & Promise"
        icon={<Target size={18} />}
        animationIndex={1}
      >
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-1.5">
            Purpose
          </p>
          <p className="text-[14px] text-[#0F172A] leading-relaxed">
            {space.purpose}
          </p>
        </div>
        <div className="h-px bg-[#E2E8F0] my-4" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-1.5">
            Promise
          </p>
          <p className="text-[14px] text-[#0F172A] leading-relaxed italic">
            {space.promise}
          </p>
        </div>
      </DetailSection>

      {/* ── Status Overview ────────────────────────────────────── */}
      <DetailSection
        title="Status Overview"
        icon={<CheckCircle2 size={18} />}
        animationIndex={2}
      >
        {/* Status Grid: 2x3 on desktop, 1-col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Design */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-1.5">
              Design
            </p>
            <StatusBadge status={space.designStatus} />
            <ProgressBar status={space.designStatus} />
          </div>
          {/* Dev */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-1.5">
              Dev
            </p>
            <StatusBadge status={space.devStatus} />
            <ProgressBar status={space.devStatus} />
          </div>
          {/* Data */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-1.5">
              Data
            </p>
            <StatusBadge status={space.dataStatus} />
            <ProgressBar status={space.dataStatus} />
          </div>
          {/* Marketing */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-1.5">
              Marketing
            </p>
            <StatusBadge status={space.marketingStatus} />
            <ProgressBar status={space.marketingStatus} />
          </div>
        </div>
        {/* Launch Status — full width */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-1.5">
            Launch
          </p>
          <StatusBadge status={space.launchStatus} />
          <ProgressBar status={space.launchStatus} />
        </div>
        <StatusSummary space={space} />
      </DetailSection>

      {/* ── Primary Users ──────────────────────────────────────── */}
      <DetailSection
        title="Primary Users"
        icon={<Users size={18} />}
        count={space.primaryUsers.length}
        animationIndex={3}
      >
        {space.primaryUsers.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">No users defined yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {space.primaryUsers.map((user) => (
              <div
                key={user}
                className="inline-flex items-center gap-2 bg-[#F1F5F9] rounded-lg px-3 py-2"
              >
                <Users size={14} className="text-[#475569]" />
                <span className="text-[13px] font-medium text-[#0F172A]">
                  {user}
                </span>
              </div>
            ))}
          </div>
        )}
      </DetailSection>

      {/* ── Plan Access ────────────────────────────────────────── */}
      <DetailSection
        title="Plan Access"
        icon={<Layers size={18} />}
        animationIndex={4}
      >
        {space.planAccess.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">No plan access defined.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {space.planAccess.map((plan) => (
              <div
                key={plan}
                className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5"
              >
                <span className="text-[13px] font-semibold text-[#0F172A]">
                  {plan}
                </span>
                <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.04em] bg-[#22C55E]/10 text-[#22C55E]">
                  Full Access
                </span>
              </div>
            ))}
          </div>
        )}
      </DetailSection>

      {/* ── Views ──────────────────────────────────────────────── */}
      <DetailSection
        title="Views"
        icon={<Eye size={18} />}
        count={space.views.length}
        animationIndex={5}
      >
        {space.views.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">No views defined yet.</p>
        ) : (
          <div className="space-y-2">
            {space.views.map((view) => (
              <div
                key={view}
                className="flex items-center gap-3 bg-[#F1F5F9] rounded-lg px-4 py-3"
              >
                <Eye size={14} className="text-[#475569] flex-shrink-0" />
                <span className="text-[14px] font-medium text-[#0F172A]">
                  {view}
                </span>
              </div>
            ))}
          </div>
        )}
      </DetailSection>

      {/* ── Pages ──────────────────────────────────────────────── */}
      <DetailSection
        title="Pages"
        icon={<FileText size={18} />}
        count={space.pages.length}
        animationIndex={6}
      >
        {space.pages.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">No pages defined yet.</p>
        ) : (
          <div className="space-y-2">
            {space.pages.map((page) => (
              <div
                key={page}
                className="flex items-center gap-3 bg-[#F1F5F9] rounded-lg px-4 py-3"
              >
                <Layout size={14} className="text-[#475569] flex-shrink-0" />
                <span className="text-[14px] font-medium text-[#0F172A]">
                  {page}
                </span>
              </div>
            ))}
          </div>
        )}
      </DetailSection>

      {/* ── Data Sources ───────────────────────────────────────── */}
      <DetailSection
        title="Data Sources"
        icon={<Database size={18} />}
        count={dataSources.length}
        animationIndex={7}
      >
        {dataSources.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">No data sources defined.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] pb-2 pr-4">
                    Source
                  </th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] pb-2 pr-4 w-[100px]">
                    Type
                  </th>
                  <th className="text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] pb-2">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((ds, i) => {
                  const isString = typeof ds === 'string';
                  const name = isString ? (ds as string) : (ds as DataSource).name;
                  const type = isString ? 'Manual' : (ds as DataSource).type;
                  const desc = isString
                    ? 'Data source for this space'
                    : (ds as DataSource).description;
                  const typeColors: Record<string, string> = {
                    API: '#3B82F6',
                    Database: '#22C55E',
                    Integration: '#8B5CF6',
                    Manual: '#6B7280',
                    AI: '#EC4899',
                  };
                  return (
                    <tr
                      key={i}
                      className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <span className="text-[14px] font-medium text-[#0F172A]">
                          {name}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className="inline-flex items-center h-[22px] px-[10px] rounded-full text-[11px] font-medium uppercase tracking-[0.04em] border"
                          style={{
                            backgroundColor: `${typeColors[type] || '#6B7280'}1F`,
                            color: typeColors[type] || '#6B7280',
                            borderColor: `${typeColors[type] || '#6B7280'}40`,
                          }}
                        >
                          {type}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[12px] text-[#475569]">
                          {desc}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DetailSection>

      {/* ── Components ─────────────────────────────────────────── */}
      <DetailSection
        title="Components"
        icon={<Puzzle size={18} />}
        count={space.components.length}
        animationIndex={8}
      >
        {space.components.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">No components listed yet.</p>
        ) : (
          <div className="space-y-2">
            {space.components.map((comp) => (
              <div
                key={comp}
                className="flex items-center gap-3 bg-[#F1F5F9] rounded-lg px-4 py-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] flex-shrink-0" />
                <span className="text-[14px] font-medium text-[#0F172A]">
                  {comp}
                </span>
              </div>
            ))}
          </div>
        )}
      </DetailSection>

      {/* ── Dependencies ───────────────────────────────────────── */}
      <DetailSection
        title="Dependencies"
        icon={<GitBranch size={18} />}
        animationIndex={9}
      >
        {/* Upstream */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-2">
            This space depends on
          </p>
          {upstreamSpaces.length === 0 ? (
            <p className="text-[13px] text-[#94A3B8]">
              No upstream dependencies.
            </p>
          ) : (
            <div className="space-y-2">
              {upstreamSpaces.map((dep) => (
                <Link
                  key={dep.id}
                  to={`/spaces/${dep.slug}`}
                  className="flex items-center gap-3 bg-[#F1F5F9] rounded-lg px-4 py-3 hover:bg-[#E2E8F0] transition-colors group"
                >
                  <GitBranch
                    size={14}
                    className="text-[#475569] flex-shrink-0"
                  />
                  <span className="text-[14px] font-medium text-[#0F172A] group-hover:text-[#5B8DEF] transition-colors">
                    {dep.name}
                  </span>
                  <PhaseBadge phase={dep.phase} />
                  <ChevronRight
                    size={14}
                    className="text-[#94A3B8] ml-auto flex-shrink-0"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        {upstreamSpaces.length > 0 && downstreamSpaces.length > 0 && (
          <div className="h-px bg-[#E2E8F0] my-4" />
        )}

        {/* Downstream */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94A3B8] mb-2">
            Spaces that depend on this
          </p>
          {downstreamSpaces.length === 0 ? (
            <p className="text-[13px] text-[#94A3B8]">
              No downstream dependents.
            </p>
          ) : (
            <div className="space-y-2">
              {downstreamSpaces.map((dep) => (
                <Link
                  key={dep.id}
                  to={`/spaces/${dep.slug}`}
                  className="flex items-center gap-3 bg-[#F1F5F9] rounded-lg px-4 py-3 hover:bg-[#E2E8F0] transition-colors group"
                >
                  <GitBranch
                    size={14}
                    className="text-[#475569] flex-shrink-0"
                  />
                  <span className="text-[14px] font-medium text-[#0F172A] group-hover:text-[#5B8DEF] transition-colors">
                    {dep.name}
                  </span>
                  <PhaseBadge phase={dep.phase} />
                  <ChevronRight
                    size={14}
                    className="text-[#94A3B8] ml-auto flex-shrink-0"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </DetailSection>

      {/* ── Open Questions ─────────────────────────────────────── */}
      <DetailSection
        title="Open Questions"
        icon={<HelpCircle size={18} />}
        count={openQuestionCount > 0 ? openQuestionCount : undefined}
        countAmber={openQuestionCount > 0}
        animationIndex={10}
      >
        {space.openQuestions.length === 0 ? (
          <div className="flex items-center gap-3 py-2">
            <CheckCircle2 size={18} className="text-[#22C55E] flex-shrink-0" />
            <p className="text-[14px] font-medium text-[#22C55E]">
              No open questions. All clear!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {space.openQuestions.map((oq, i) => (
              <OpenQuestionCard
                key={i}
                question={oq.question}
                context={oq.context}
                status={oq.status}
                priority={oq.priority}
              />
            ))}
          </div>
        )}
      </DetailSection>

      {/* ── Notes ──────────────────────────────────────────────── */}
      <DetailSection
        title="Notes"
        icon={<StickyNote size={18} />}
        animationIndex={11}
      >
        {space.notes ? (
          <div className="bg-[#F1F5F9] rounded-lg p-4">
            <p className="text-[13px] text-[#475569] leading-[1.7] whitespace-pre-wrap">
              {space.notes}
            </p>
          </div>
        ) : (
          <p className="text-[13px] text-[#94A3B8]">No notes yet.</p>
        )}
      </DetailSection>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
