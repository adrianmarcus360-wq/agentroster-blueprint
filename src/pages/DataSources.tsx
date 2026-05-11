import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  MapPin,
  FlaskConical,
  Plug,
  Database,
  Link2,
  Brain,
  FileText,
  Search,
  X,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import { spaces } from '@/data/spaces';
import Footer from '@/components/Footer';
import type { DataSourceStatus } from '@/data/spaces';

// ── Inferred Data Source Mapping ──────────────────────────────────
// Seed data has plain strings for dataSources. We infer rich metadata.

interface InferredDataSource {
  name: string;
  type: 'API' | 'Database' | 'Integration' | 'Manual' | 'AI';
  status: DataSourceStatus;
  description: string;
}

const TYPE_COLORS: Record<string, { color: string; icon: typeof Plug }> = {
  API: { color: '#3B82F6', icon: Plug },
  Database: { color: '#22C55E', icon: Database },
  Integration: { color: '#8B5CF6', icon: Link2 },
  AI: { color: '#EC4899', icon: Brain },
  Manual: { color: '#94A3B8', icon: FileText },
};

const STATUS_COLORS: Record<DataSourceStatus, string> = {
  Connected: '#22C55E',
  Pending: '#F59E0B',
  Planned: '#3B82F6',
  Mock: '#94A3B8',
};

function inferType(name: string): InferredDataSource['type'] {
  const lower = name.toLowerCase();
  if (lower.includes('api')) return 'API';
  if (lower.includes('db') || lower.includes('database') || lower.includes('sql') || lower.includes('postgres') || lower.includes('redis') || lower.includes('elasticsearch')) return 'Database';
  if (lower.includes('oauth') || lower.includes('slack') || lower.includes('notion') || lower.includes('linear') || lower.includes('stripe') || lower.includes('sendgrid') || lower.includes('hubspot') || lower.includes('mixpanel') || lower.includes('s3') || lower.includes('integration') || lower.includes('mcp') || lower.includes('partner') || lower.includes('connected')) return 'Integration';
  if (lower.includes('ai') || lower.includes('llm') || lower.includes('ml') || lower.includes('brain') || lower.includes('scout') || lower.includes('recommendation') || lower.includes('signals')) return 'AI';
  if (lower.includes('mock')) return 'Manual';
  return 'Manual';
}

function inferStatus(name: string): DataSourceStatus {
  const lower = name.toLowerCase();
  if (lower.includes('mock')) return 'Mock';
  if (lower.includes('pending') || lower.includes('planned') || lower.includes('later')) return 'Planned';
  // Treat most seed data sources as "Connected" since they represent active system data
  if (lower.includes('api') || lower.includes('db') || lower.includes('user input') || lower.includes('brain') || lower.includes('directory') || lower.includes('connected')) return 'Connected';
  return 'Connected';
}

function inferDescription(name: string, type: string): string {
  const descs: Record<string, string> = {
    API: 'External API endpoint providing real-time data integration.',
    Database: 'Internal database storing structured application data.',
    Integration: 'Third-party service integration for extended capabilities.',
    AI: 'AI/ML model connection for intelligent data processing.',
    Manual: 'Human-entered or uploaded data requiring manual curation.',
  };
  return descs[type] || `Data source: ${name}`;
}

function parseDataSources(): Record<string, InferredDataSource[]> {
  const result: Record<string, InferredDataSource[]> = {};
  for (const space of spaces) {
    result[space.name] = space.dataSources.map((ds) => {
      const name = typeof ds === 'string' ? ds : ds.name;
      const type = typeof ds === 'string' ? inferType(name) : (ds.type as InferredDataSource['type']);
      const status = typeof ds === 'string' ? inferStatus(name) : (ds.status as DataSourceStatus);
      const description = typeof ds === 'string' ? inferDescription(name, type) : ds.description;
      return { name, type, status, description };
    });
  }
  return result;
}

// ── Animation Variants ────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ── Filter Pill Component ─────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
  dotColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dotColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] font-medium
        transition-all duration-200 border
        ${active
          ? 'bg-[#5B8DEF] text-white border-[#5B8DEF]'
          : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
        }
      `}
    >
      {dotColor && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {label}
    </button>
  );
}

// ── Source Card ───────────────────────────────────────────────────

function SourceCard({
  source,
  spaceName,
  spaceSlug,
}: {
  source: InferredDataSource;
  spaceName: string;
  spaceSlug: string;
}) {
  const typeMeta = TYPE_COLORS[source.type];
  const TypeIcon = typeMeta.icon;
  const statusColor = STATUS_COLORS[source.status];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      {/* Header: Icon + Name */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${typeMeta.color}12`, color: typeMeta.color }}
        >
          <TypeIcon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-[#0F172A] leading-tight mb-1">
            {source.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-medium uppercase tracking-[0.04em]"
              style={{ color: typeMeta.color }}
            >
              {source.type}
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              <span className="text-[12px] text-[#475569]">{source.status}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-[#475569] leading-relaxed line-clamp-2 mb-3">
        {source.description}
      </p>

      {/* Space pill */}
      <div className="flex items-center justify-between">
        <Link
          to={`/spaces/${spaceSlug}`}
          className="inline-flex items-center px-2 py-1 rounded-md bg-[#F1F5F9] text-[11px] text-[#475569] hover:bg-[#E2E8F0] transition-colors duration-150"
        >
          {spaceName}
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Page Component ───────────────────────────────────────────

export default function DataSources() {
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const parsedSources = useMemo(() => parseDataSources(), []);

  // Compute counts for summary cards
  const { connected, pending, planned, mock } = useMemo(() => {
    let connected = 0;
    let pending = 0;
    let planned = 0;
    let mock = 0;
    for (const spaceSources of Object.values(parsedSources)) {
      for (const s of spaceSources) {
        if (s.status === 'Connected') connected++;
        else if (s.status === 'Pending') pending++;
        else if (s.status === 'Planned') planned++;
        else if (s.status === 'Mock') mock++;
      }
    }
    return { connected, pending, planned, mock };
  }, [parsedSources]);

  // Filter sources
  const filteredSpaces = useMemo(() => {
    return spaces
      .map((space) => {
        const sources = parsedSources[space.name] || [];
        const filtered = sources.filter((s) => {
          const matchType = typeFilter === 'All' || s.type === typeFilter;
          const matchStatus = statusFilter === 'All' || s.status === statusFilter;
          const matchSearch =
            searchQuery === '' ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchType && matchStatus && matchSearch;
        });
        return { space, sources: filtered };
      })
      .filter(({ sources }) => sources.length > 0);
  }, [parsedSources, typeFilter, statusFilter, searchQuery]);

  const totalFiltered = filteredSpaces.reduce((sum, { sources }) => sum + sources.length, 0);

  const typeOptions = ['All', 'API', 'Database', 'Integration', 'AI', 'Manual'];
  const statusOptions: DataSourceStatus[] = ['Connected', 'Pending', 'Planned', 'Mock'];

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="show"
        className="pb-6 mb-6 border-b border-[#E2E8F0]"
      >
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#0F172A] mb-2">
          Data Sources Map
        </h1>
        <p className="text-[14px] text-[#475569]">
          What data powers every space
        </p>
      </motion.div>

      {/* ── Health Summary Cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<CheckCircle2 size={32} />}
          value={connected}
          label="Connected"
          accentColor="#22C55E"
        />
        <StatCard
          icon={<Clock size={32} />}
          value={pending}
          label="Pending"
          accentColor="#F59E0B"
        />
        <StatCard
          icon={<MapPin size={32} />}
          value={planned}
          label="Planned"
          accentColor="#3B82F6"
        />
        <StatCard
          icon={<FlaskConical size={32} />}
          value={mock}
          label="Mock Data"
          subtext="Using placeholder data"
          accentColor="#94A3B8"
        />
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="pb-4 mb-6 border-b border-[#E2E8F0]"
      >
        {/* Type filters */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-[12px] font-medium text-[#94A3B8] uppercase tracking-[0.02em] mr-1">
            Type
          </span>
          {typeOptions.map((t) => (
            <FilterPill
              key={t}
              label={t}
              active={typeFilter === t}
              onClick={() => setTypeFilter(t)}
              dotColor={t === 'All' ? undefined : TYPE_COLORS[t]?.color}
            />
          ))}
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-[12px] font-medium text-[#94A3B8] uppercase tracking-[0.02em] mr-1">
            Status
          </span>
          <FilterPill
            label="All"
            active={statusFilter === 'All'}
            onClick={() => setStatusFilter('All')}
          />
          {statusOptions.map((s) => (
            <FilterPill
              key={s}
              label={s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
              dotColor={STATUS_COLORS[s]}
            />
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search sources or spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-9 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF] transition-all duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-2 text-[12px] text-[#94A3B8]">
          Showing {totalFiltered} data source{totalFiltered !== 1 ? 's' : ''}
          {typeFilter !== 'All' && ` · Type: ${typeFilter}`}
          {statusFilter !== 'All' && ` · Status: ${statusFilter}`}
        </div>
      </motion.div>

      {/* ── Sources by Space ────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filteredSpaces.map(({ space, sources }) => (
          <div key={space.id} className="mb-10">
            <motion.div variants={itemVariants}>
              <SectionHeader
                title={space.name}
                count={sources.length}
                viewAllLink={`/spaces/${space.slug}`}
                viewAllLabel="Space detail"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sources.map((source) => (
                <SourceCard
                  key={`${space.id}-${source.name}`}
                  source={source}
                  spaceName={space.name}
                  spaceSlug={space.slug}
                />
              ))}
            </div>
          </div>
        ))}

        {filteredSpaces.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Database size={48} className="text-[#E2E8F0] mb-4" />
            <p className="text-[16px] font-medium text-[#475569] mb-1">
              No data sources match your filters
            </p>
            <p className="text-[13px] text-[#94A3B8]">
              Try adjusting your type, status, or search filters
            </p>
          </motion.div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}
