import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Quote,
  Search,
  Link2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Clock,
  Copy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';

// ── Types ──────────────────────────────────────────────────────────

interface CorePhrase {
  id: number;
  phrase: string;
  context: string;
  usageCount: number;
}

interface ProofItem {
  description: string;
  state: 'proven' | 'missing' | 'pending';
}

type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'None';
type ProofStatus = 'Proven' | 'Needs Proof';
type ClaimCategory = 'Company-level' | 'Brain' | 'Scout' | 'Atlas' | 'Audit' | 'Service Provider';

interface Claim {
  id: string;
  claim: string;
  space: string;
  slug: string;
  category: ClaimCategory;
  confidence: ConfidenceLevel;
  status: ProofStatus;
  proofSurfaces: ProofItem[];
  evidenceNotes: string;
  targetAudience: string[];
}

// ── Seed Data ──────────────────────────────────────────────────────

const corePhrases: CorePhrase[] = [
  {
    id: 1,
    phrase: 'Keep your stack. Add the Brain.',
    context: 'Tagline, footer, sidebar, all public surfaces',
    usageCount: 16,
  },
  {
    id: 2,
    phrase: 'AgentRoster is the Brain above your tools.',
    context: 'Pitch line, overview, hero sections',
    usageCount: 12,
  },
  {
    id: 3,
    phrase: 'The dots were always there. AgentRoster connects them.',
    context: 'Value prop, marketing copy, social',
    usageCount: 8,
  },
  {
    id: 4,
    phrase: 'Brain Build turns one conversation into your personal or company operating graph.',
    context: 'Brain Build space description',
    usageCount: 4,
  },
  {
    id: 5,
    phrase: 'Scout helps users understand their world. Atlas maps the ecosystem.',
    context: 'Scout/Atlas product description',
    usageCount: 6,
  },
];

const claims: Claim[] = [
  {
    id: 'claim-1',
    claim: 'One conversation becomes your personal operating graph',
    space: 'Brain Build',
    slug: 'brain-build',
    category: 'Brain',
    confidence: 'High',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Product demo video', state: 'proven' },
      { description: 'Case study with named customer', state: 'missing' },
      { description: 'In-app onboarding flow (ships v1.2)', state: 'pending' },
    ],
    evidenceNotes: 'Demo video in production. Case study pending customer approval.',
    targetAudience: ['Prospects', 'Product Teams'],
  },
  {
    id: 'claim-2',
    claim: 'Keep your stack. Add the Brain.',
    space: 'Homepage',
    slug: 'homepage',
    category: 'Company-level',
    confidence: 'High',
    status: 'Proven',
    proofSurfaces: [
      { description: 'Tagline live on site', state: 'proven' },
      { description: 'Brand guide published', state: 'proven' },
    ],
    evidenceNotes: 'Core language phrase validated across all public surfaces.',
    targetAudience: ['All Users', 'Public'],
  },
  {
    id: 'claim-3',
    claim: 'Connect all your tools in one place',
    space: 'Brain Connect',
    slug: 'brain-connect',
    category: 'Brain',
    confidence: 'Medium',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Integrations list', state: 'missing' },
      { description: 'Demo video', state: 'missing' },
    ],
    evidenceNotes: 'Integration count growing but not yet at parity with competitors.',
    targetAudience: ['Integrators', 'Enterprise'],
  },
  {
    id: 'claim-4',
    claim: 'Map your entire ecosystem',
    space: 'Atlas Profile',
    slug: 'atlas-profile',
    category: 'Atlas',
    confidence: 'Medium',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Atlas demo', state: 'missing' },
      { description: 'Profile example', state: 'pending' },
    ],
    evidenceNotes: 'Profile data model is solid but demo environment needs seed data.',
    targetAudience: ['Analysts', 'Partners'],
  },
  {
    id: 'claim-5',
    claim: 'AI-powered work graph audit',
    space: 'Work Graph Audit',
    slug: 'work-graph-audit',
    category: 'Audit',
    confidence: 'Low',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Audit report', state: 'missing' },
      { description: 'Methodology documentation', state: 'pending' },
    ],
    evidenceNotes: 'Audit methodology still being refined with internal stakeholders.',
    targetAudience: ['Enterprise', 'Auditors'],
  },
  {
    id: 'claim-6',
    claim: 'The Brain above your tools',
    space: 'Homepage',
    slug: 'homepage',
    category: 'Company-level',
    confidence: 'High',
    status: 'Proven',
    proofSurfaces: [
      { description: 'Homepage live', state: 'proven' },
      { description: 'Pitch deck', state: 'proven' },
    ],
    evidenceNotes: 'Core positioning validated with investor and customer feedback.',
    targetAudience: ['Investors', 'Prospects'],
  },
  {
    id: 'claim-7',
    claim: 'Understand your world with Scout',
    space: 'Feed',
    slug: 'feed',
    category: 'Scout',
    confidence: 'Medium',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Scout brief example', state: 'pending' },
      { description: 'User engagement metrics', state: 'missing' },
    ],
    evidenceNotes: 'Scout v1 shipped. Awaiting usage metrics from first 30 days.',
    targetAudience: ['Users', 'Analysts'],
  },
  {
    id: 'claim-8',
    claim: 'Find compatible service providers',
    space: 'Service Network',
    slug: 'service-network',
    category: 'Service Provider',
    confidence: 'Low',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Network data', state: 'missing' },
      { description: 'Matching demo', state: 'missing' },
    ],
    evidenceNotes: 'Service Network feature is in early design. No production data yet.',
    targetAudience: ['Service Providers', 'Customers'],
  },
  {
    id: 'claim-9',
    claim: 'Turn interviews into insights',
    space: 'What We Heard',
    slug: 'what-we-heard',
    category: 'Brain',
    confidence: 'Medium',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Sample report', state: 'pending' },
      { description: 'Customer quote', state: 'missing' },
    ],
    evidenceNotes: 'Sample report in review with design team. Customer quotes pending outreach.',
    targetAudience: ['Researchers', 'PMs'],
  },
  {
    id: 'claim-10',
    claim: "Your company's operating system",
    space: 'Business Brain',
    slug: 'business-brain',
    category: 'Brain',
    confidence: 'Low',
    status: 'Needs Proof',
    proofSurfaces: [
      { description: 'Platform demo', state: 'missing' },
      { description: 'ROI data', state: 'missing' },
    ],
    evidenceNotes: 'Business Brain is in early development. ROI calculator planned for Q3.',
    targetAudience: ['Executives', 'Decision Makers'],
  },
];

// ── Helpers ────────────────────────────────────────────────────────

const confidenceColors: Record<ConfidenceLevel, string> = {
  High: '#22C55E',
  Medium: '#F59E0B',
  Low: '#F97316',
  None: '#6B7280',
};

const proofStatusColors: Record<ProofStatus, string> = {
  Proven: '#22C55E',
  'Needs Proof': '#DC2626',
};

const categoryOrder: ClaimCategory[] = [
  'Company-level',
  'Brain',
  'Scout',
  'Atlas',
  'Audit',
  'Service Provider',
];

// ── Sub-Components ─────────────────────────────────────────────────

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const color = confidenceColors[level];
  return (
    <span
      className="inline-flex items-center h-[22px] px-[10px] rounded-full text-[11px] font-medium uppercase tracking-[0.04em] border"
      style={{
        backgroundColor: `${color}1F`,
        color,
        borderColor: `${color}40`,
      }}
    >
      {level}
    </span>
  );
}

function ProofStatusBadge({ status }: { status: ProofStatus }) {
  const color = proofStatusColors[status];
  return (
    <span
      className="inline-flex items-center h-[22px] px-[10px] rounded-full text-[11px] font-medium uppercase tracking-[0.04em] border"
      style={{
        backgroundColor: `${color}1F`,
        color,
        borderColor: `${color}40`,
      }}
    >
      {status}
    </span>
  );
}

function AudienceBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-5 px-2 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
      {label}
    </span>
  );
}

function ProofSurfaceIcon({ state }: { state: ProofItem['state'] }) {
  if (state === 'proven') {
    return <Check size={16} className="text-[#22C55E] shrink-0" />;
  }
  if (state === 'missing') {
    return <X size={16} className="text-[#DC2626] shrink-0" />;
  }
  return <Clock size={16} className="text-[#F59E0B] shrink-0" />;
}

function CorePhraseCard({ phrase, index }: { phrase: CorePhrase; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phrase.phrase).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.4 + index * 0.06,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      onClick={handleCopy}
      className="relative cursor-pointer rounded-r-lg border-l-4 border-[#5B8DEF] p-4 pr-12 transition-colors duration-200 hover:bg-[rgba(91,141,239,0.08)]"
      style={{ backgroundColor: 'rgba(91,141,239,0.05)' }}
    >
      <p className="text-[15px] font-semibold text-[#0F172A] mb-1">
        &ldquo;{phrase.phrase}&rdquo;
      </p>
      <p className="text-[12px] text-[#475569]">{phrase.context}</p>
      <span
        className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-medium mt-2"
        style={{
          backgroundColor: 'rgba(91,141,239,0.12)',
          color: '#5B8DEF',
        }}
      >
        Used in {phrase.usageCount} spaces
      </span>
      {copied && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-3 right-3 text-[11px] font-medium text-[#22C55E] flex items-center gap-1"
        >
          <Check size={12} /> Copied!
        </motion.span>
      )}
      {!copied && (
        <Copy
          size={14}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#5B8DEF] transition-colors"
        />
      )}
    </motion.div>
  );
}

function ClaimCard({ claim, index }: { claim: Claim; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const borderColor =
    claim.status === 'Needs Proof' ? '#DC2626' : '#22C55E';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.7 + index * 0.05,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      onClick={() => setExpanded(!expanded)}
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 cursor-pointer transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.04)]"
      style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}
    >
      {/* Claim Label + Text */}
      <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#94A3B8]">
        Claim
      </span>
      <p className="text-[15px] font-semibold text-[#0F172A] mt-1 leading-snug">
        &ldquo;{claim.claim}&rdquo;
      </p>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
        <Link
          to={`/spaces/${claim.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-[13px] text-[#5B8DEF] hover:underline transition-colors duration-200"
        >
          <Link2 size={13} />
          {claim.space}
        </Link>
        <ConfidenceBadge level={claim.confidence} />
        <ProofStatusBadge status={claim.status} />
      </div>

      {/* Target Audience */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {claim.targetAudience.map((aud) => (
          <AudienceBadge key={aud} label={aud} />
        ))}
      </div>

      {/* Proof Surfaces */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
        <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#94A3B8]">
          Proof Surfaces
        </span>
        <div className="mt-2 space-y-1.5">
          {claim.proofSurfaces.map((surface) => (
            <div key={surface.description} className="flex items-center gap-2">
              <ProofSurfaceIcon state={surface.state} />
              <span
                className={`text-[13px] ${
                  surface.state === 'missing'
                    ? 'text-[#94A3B8] line-through'
                    : 'text-[#475569]'
                }`}
              >
                {surface.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Notes (collapsible) */}
      <AnimatePresence>
        {(notesExpanded || expanded) && claim.evidenceNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-[#E2E8F0] overflow-hidden"
          >
            <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#94A3B8]">
              Evidence Notes
            </span>
            <p className="text-[12px] text-[#475569] italic mt-1">
              {claim.evidenceNotes}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show/Hide notes link */}
      {claim.evidenceNotes && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setNotesExpanded(!notesExpanded);
          }}
          className="flex items-center gap-1 mt-3 text-[12px] font-medium text-[#5B8DEF] hover:underline transition-colors"
        >
          {notesExpanded ? (
            <>
              <ChevronUp size={12} /> Hide notes
            </>
          ) : (
            <>
              <ChevronDown size={12} /> Show notes
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export default function Claims() {
  const [confidenceFilter, setConfidenceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived stats
  const totalClaims = claims.length;
  const provenClaims = claims.filter((c) => c.status === 'Proven').length;
  const needsProofClaims = claims.filter((c) => c.status === 'Needs Proof').length;
  const coreLanguageCount = corePhrases.length;

  // Filter logic
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      if (confidenceFilter !== 'All' && claim.confidence !== confidenceFilter)
        return false;
      if (statusFilter !== 'All' && claim.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          claim.claim.toLowerCase().includes(q) ||
          claim.space.toLowerCase().includes(q) ||
          claim.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [confidenceFilter, statusFilter, searchQuery]);

  // Group by category
  const groupedClaims = useMemo(() => {
    const groups: Partial<Record<ClaimCategory, Claim[]>> = {};
    for (const claim of filteredClaims) {
      if (!groups[claim.category]) groups[claim.category] = [];
      groups[claim.category]!.push(claim);
    }
    // Sort within each group: Needs Proof first, then by confidence
    for (const cat of Object.keys(groups) as ClaimCategory[]) {
      groups[cat]!.sort((a, b) => {
        if (a.status === 'Needs Proof' && b.status !== 'Needs Proof') return -1;
        if (a.status !== 'Needs Proof' && b.status === 'Needs Proof') return 1;
        const confOrder: Record<ConfidenceLevel, number> = {
          High: 0,
          Medium: 1,
          Low: 2,
          None: 3,
        };
        if (confOrder[a.confidence] !== confOrder[b.confidence]) {
          return confOrder[a.confidence] - confOrder[b.confidence];
        }
        return a.claim.localeCompare(b.claim);
      });
    }
    return groups;
  }, [filteredClaims]);

  const confidenceOptions = ['All', 'High', 'Medium', 'Low', 'None'];
  const statusOptions = ['All', 'Proven', 'Needs Proof'];

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="pb-6 mb-6 border-b border-[#E2E8F0]"
      >
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#0F172A]">
          Marketing Claims Map
        </h1>
        <p className="text-[14px] text-[#475569] mt-1">
          Every claim we make. Every proof we have.
        </p>
      </motion.div>

      {/* ── Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<FileText size={32} />}
          value={totalClaims}
          label="Total Claims"
          accentColor="#5B8DEF"
        />
        <StatCard
          icon={<CheckCircle2 size={32} />}
          value={provenClaims}
          label="Proven Claims"
          accentColor="#22C55E"
        />
        <StatCard
          icon={<AlertCircle size={32} />}
          value={needsProofClaims}
          label="Need Evidence"
          accentColor="#DC2626"
          pulse={needsProofClaims > 0}
          onClick={() => setStatusFilter('Needs Proof')}
          className={needsProofClaims > 0 ? 'bg-red-50/30' : ''}
        />
        <StatCard
          icon={<Quote size={32} />}
          value={coreLanguageCount}
          label="Core Language Phrases"
          accentColor="#FFB347"
        />
      </div>

      {/* ── Core Language Section ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <SectionHeader
          title="Core Language"
          count={corePhrases.length}
          className="mb-3"
        />
        <p className="text-[13px] text-[#475569] mb-5">
          These phrases are sacred. Use them exactly. &mdash; Immutable
        </p>

        <div className="space-y-3 mb-10">
          {corePhrases.map((phrase, i) => (
            <CorePhraseCard key={phrase.id} phrase={phrase} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="mb-6"
      >
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          {/* Confidence Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#94A3B8] mr-1">
              Confidence
            </span>
            {confidenceOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setConfidenceFilter(opt)}
                className={`h-8 px-3.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
                  confidenceFilter === opt
                    ? 'bg-[#5B8DEF] text-white border-[#5B8DEF]'
                    : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-medium uppercase tracking-[0.02em] text-[#94A3B8] mr-1">
              Status
            </span>
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`h-8 px-3.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
                  statusFilter === opt
                    ? opt === 'Proven'
                      ? 'bg-[#22C55E] text-white border-[#22C55E]'
                      : opt === 'Needs Proof'
                        ? 'bg-[#DC2626] text-white border-[#DC2626]'
                        : 'bg-[#5B8DEF] text-white border-[#5B8DEF]'
                    : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-3 rounded-full text-[12px] font-medium border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#5B8DEF] focus:ring-1 focus:ring-[#5B8DEF] transition-all w-[180px]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Claims List ─────────────────────────────────────────── */}
      <div className="space-y-8">
        {filteredClaims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-[14px] text-[#94A3B8]">
              No claims match your filters.
            </p>
            <button
              onClick={() => {
                setConfidenceFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="mt-3 text-[12px] font-medium text-[#5B8DEF] hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          categoryOrder.map((category) => {
            const groupClaims = groupedClaims[category];
            if (!groupClaims || groupClaims.length === 0) return null;

            return (
              <div key={category}>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }}
                  className="text-[16px] font-semibold text-[#0F172A] tracking-[-0.01em] mb-3 flex items-center gap-2"
                >
                  {category}
                  <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                    {groupClaims.length}
                  </span>
                </motion.h3>
                <div className="space-y-3">
                  {groupClaims.map((claim, i) => (
                    <ClaimCard key={claim.id} claim={claim} index={i} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
