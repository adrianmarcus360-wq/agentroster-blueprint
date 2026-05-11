import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  CreditCard,
  Gift,
  CheckCircle2,
  Eye,
  Lock,
  XCircle,
  User,
  Building2,
  Wrench,
  Puzzle,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import PhaseBadge from '@/components/PhaseBadge';
import { spaces } from '@/data/spaces';
import Footer from '@/components/Footer';

// ── Access Matrix Data (from design spec) ────────────────────────

const PLAN_TIERS = ['Free', 'Pro', 'Team', 'Enterprise'] as const;
type PlanTier = (typeof PLAN_TIERS)[number];
type AccessLevel = 'Full' | 'View' | 'Limited' | 'None';

// Hardcoded access mapping per the design spec sample data
const ACCESS_MATRIX: Record<string, AccessLevel[]> = {
  'Homepage / Public Site': ['Full', 'Full', 'Full', 'Full'],
  'Pricing / Packaging': ['Full', 'Full', 'Full', 'Full'],
  'Onboarding / Quick Start': ['Full', 'Full', 'Full', 'Full'],
  'Brain Build / Scout Interview': ['Full', 'Full', 'Full', 'Full'],
  'This Is What We Heard': ['View', 'Full', 'Full', 'Full'],
  'Brain Snapshot / Reports': ['View', 'View', 'Full', 'Full'],
  'Feed / Scout Brief': ['View', 'View', 'Full', 'Full'],
  'Scout Inbox / Brain Backlog': ['None', 'Limited', 'Full', 'Full'],
  'Brain Connect': ['None', 'Limited', 'Full', 'Full'],
  'ARM / AgentRoster Management': ['None', 'None', 'Full', 'Full'],
  'Directory / Ecosystem': ['View', 'View', 'Full', 'Full'],
  'Skills Space': ['View', 'Limited', 'Full', 'Full'],
  'Service Provider Network': ['View', 'View', 'Full', 'Full'],
  'Atlas Profile Build / Compatibility Network': ['None', 'Limited', 'Full', 'Full'],
  'AI Work Graph Audit': ['None', 'None', 'Limited', 'Full'],
  'Business Brain': ['None', 'None', 'None', 'Full'],
};

const ACCESS_CONFIG: Record<
  AccessLevel,
  {
    icon: typeof CheckCircle2;
    color: string;
    bgTint: string;
    label: string;
  }
> = {
  Full: {
    icon: CheckCircle2,
    color: '#22C55E',
    bgTint: 'rgba(34,197,94,0.05)',
    label: 'Full',
  },
  View: {
    icon: Eye,
    color: '#3B82F6',
    bgTint: 'rgba(59,130,246,0.05)',
    label: 'View',
  },
  Limited: {
    icon: Lock,
    color: '#F59E0B',
    bgTint: 'rgba(245,158,11,0.05)',
    label: 'Limited',
  },
  None: {
    icon: XCircle,
    color: '#94A3B8',
    bgTint: 'transparent',
    label: '\u2014',
  },
};

const PLAN_HEADER_COLORS: Record<PlanTier, string> = {
  Free: 'rgba(107,114,128,0.15)',
  Pro: 'rgba(91,141,239,0.15)',
  Team: 'rgba(255,179,71,0.15)',
  Enterprise: 'rgba(20,184,166,0.15)',
};

const PLAN_HEADER_TEXT_COLORS: Record<PlanTier, string> = {
  Free: '#6B7280',
  Pro: '#5B8DEF',
  Team: '#FFB347',
  Enterprise: '#14B8A6',
};

// ── User Type Definitions ────────────────────────────────────────

interface UserTypeDef {
  id: string;
  name: string;
  icon: typeof User;
  description: string;
  spaceMatcher: (spaceName: string, primaryUsers: string[]) => boolean;
}

const USER_TYPES: UserTypeDef[] = [
  {
    id: 'individual',
    name: 'Individual',
    icon: User,
    description:
      'Solo users exploring AgentRoster for personal productivity and AI-assisted task management.',
    spaceMatcher: (_name, users) =>
      users.some((u) =>
        u.toLowerCase().includes('individual') || u.toLowerCase().includes('logged-in') || u.toLowerCase().includes('all logged-in')
      ),
  },
  {
    id: 'business',
    name: 'Business',
    icon: Building2,
    description:
      'Teams and organizations using AgentRoster for workspace management, collaboration, and business operations.',
    spaceMatcher: (_name, users) =>
      users.some((u) =>
        u.toLowerCase().includes('business') || u.toLowerCase().includes('department') || u.toLowerCase().includes('ops')
      ),
  },
  {
    id: 'service-provider',
    name: 'Service Provider',
    icon: Wrench,
    description:
      'External partners, agencies, consultants, and trainers listed in the AgentRoster ecosystem.',
    spaceMatcher: (_name, users) =>
      users.some((u) =>
        u.toLowerCase().includes('service provider') || u.toLowerCase().includes('provider') || u.toLowerCase().includes('consultant')
      ),
  },
  {
    id: 'tool-partner',
    name: 'Tool Partner',
    icon: Puzzle,
    description:
      'Tool companies, SaaS vendors, and integration partners building on the AgentRoster platform.',
    spaceMatcher: (_name, users) =>
      users.some((u) =>
        u.toLowerCase().includes('tool') || u.toLowerCase().includes('partner') || u.toLowerCase().includes('company') || u.toLowerCase().includes('saas')
      ),
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: ShieldCheck,
    description:
      'Platform administrators managing workspace settings, teams, compliance, and internal operations.',
    spaceMatcher: (_name, users) =>
      users.some((u) =>
        u.toLowerCase().includes('admin') || u.toLowerCase().includes('compliance') || u.toLowerCase().includes('security')
      ),
  },
  {
    id: 'visitor',
    name: 'Logged-out Visitor',
    icon: LogOut,
    description:
      'Unauthenticated visitors browsing public surfaces, pricing, and directory content.',
    spaceMatcher: (name, users) =>
      users.some((u) => u.toLowerCase().includes('logged-out') || u.toLowerCase().includes('guest')) ||
      name.toLowerCase().includes('homepage') ||
      name.toLowerCase().includes('directory') ||
      name.toLowerCase().includes('answers'),
  },
];

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

const matrixRowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// ── Access Cell Component ────────────────────────────────────────

function AccessCell({ level }: { level: AccessLevel }) {
  const config = ACCESS_CONFIG[level];
  const Icon = config.icon;

  return (
    <div
      className="flex flex-col items-center justify-center gap-1 py-3 px-2 border-r border-[#E2E8F0] min-w-[100px]"
      style={{ backgroundColor: config.bgTint }}
      title={`${level} access`}
    >
      <Icon size={20} style={{ color: config.color, opacity: level === 'None' ? 0.3 : 1 }} />
      <span
        className="text-[12px] font-medium"
        style={{ color: level === 'None' ? '#94A3B8' : config.color }}
      >
        {config.label}
      </span>
    </div>
  );
}

// ── User Type Card ───────────────────────────────────────────────

function UserTypeCard({
  userType,
  matchedSpaces,
}: {
  userType: UserTypeDef;
  matchedSpaces: { name: string; slug: string }[];
}) {
  const Icon = userType.icon;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[rgba(91,141,239,0.1)] text-[#5B8DEF]">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-[#0F172A]">{userType.name}</h3>
          <span className="inline-flex items-center h-4 px-1.5 rounded text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
            Uses {matchedSpaces.length} space{matchedSpaces.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <p className="text-[13px] text-[#475569] leading-relaxed mb-3">
        {userType.description}
      </p>

      {matchedSpaces.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {matchedSpaces.slice(0, 6).map((space) => (
            <Link
              key={space.slug}
              to={`/spaces/${space.slug}`}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[11px] text-[#475569] hover:bg-[#E2E8F0] transition-colors duration-150"
            >
              {space.name.length > 22 ? space.name.slice(0, 22) + '...' : space.name}
            </Link>
          ))}
          {matchedSpaces.length > 6 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[11px] text-[#94A3B8]">
              +{matchedSpaces.length - 6} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Main Page Component ───────────────────────────────────────────

export default function RolesPlans() {
  // Compute summary stats
  const uniqueUserTypes = useMemo(() => {
    const allUsers = new Set<string>();
    for (const space of spaces) {
      for (const user of space.primaryUsers) {
        allUsers.add(user);
      }
    }
    return allUsers.size;
  }, []);

  const freeAccessCount = useMemo(() => {
    return Object.values(ACCESS_MATRIX).filter(
      (levels) => levels[0] === 'Full'
    ).length;
  }, []);

  // Match user types to spaces
  const userTypeSpaces = useMemo(() => {
    return USER_TYPES.map((ut) => {
      const matched = spaces
        .filter((s) => ut.spaceMatcher(s.name, s.primaryUsers))
        .map((s) => ({ name: s.name, slug: s.slug }));
      return { userType: ut, spaces: matched };
    });
  }, []);

  // Sorted spaces: Launch P0 first, then P1, P2, Coming Soon
  const sortedSpaces = useMemo(() => {
    const phaseOrder: Record<string, number> = {
      'Launch P0': 0,
      'Launch P1': 1,
      'P2': 2,
      'Coming Soon': 3,
    };
    return [...spaces].sort((a, b) => {
      const diff = (phaseOrder[a.phase] ?? 99) - (phaseOrder[b.phase] ?? 99);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });
  }, []);

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
          Roles & Plans Map
        </h1>
        <p className="text-[14px] text-[#475569]">
          Who sees what across the platform
        </p>
      </motion.div>

      {/* ── Summary Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Users size={32} />}
          value={uniqueUserTypes}
          label="User Types"
          accentColor="#5B8DEF"
        />
        <StatCard
          icon={<CreditCard size={32} />}
          value={4}
          label="Plan Tiers"
          accentColor="#FFB347"
        />
        <StatCard
          icon={<Gift size={32} />}
          value={freeAccessCount}
          label="Free-Access Spaces"
          accentColor="#22C55E"
        />
      </div>

      {/* ── Access Matrix ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="mb-10"
      >
        <SectionHeader title="Access Matrix" />

        <div className="rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Matrix Header Row */}
              <div className="flex sticky top-0 z-10">
                {/* Sticky left header cell */}
                <div className="flex-shrink-0 w-[200px] sticky left-0 z-20 bg-[#0F172A] text-[#F8FAFC] px-4 py-3 border-r border-[#334155] flex items-center">
                  <span className="text-[13px] font-semibold">Product Space</span>
                </div>
                {/* Plan columns */}
                {PLAN_TIERS.map((tier) => (
                  <div
                    key={tier}
                    className="flex-1 min-w-[100px] text-center py-3 border-r border-[#334155] last:border-r-0"
                    style={{
                      backgroundColor: PLAN_HEADER_COLORS[tier],
                    }}
                  >
                    <span
                      className="text-[13px] font-semibold"
                      style={{ color: PLAN_HEADER_TEXT_COLORS[tier] }}
                    >
                      {tier}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix Body */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {sortedSpaces.map((space) => {
                  const access = ACCESS_MATRIX[space.name] || ['None', 'None', 'None', 'None'];
                  return (
                    <motion.div
                      key={space.id}
                      variants={matrixRowVariants}
                      className="flex border-t border-[#E2E8F0] transition-colors duration-150 hover:bg-[#F1F5F9]"
                    >
                      {/* Sticky left column: Space name */}
                      <div className="flex-shrink-0 w-[200px] sticky left-0 z-10 bg-white border-r-2 border-[#E2E8F0] px-3 py-3 flex flex-col justify-center hover:bg-[#F1F5F9] transition-colors duration-150">
                        <Link
                          to={`/spaces/${space.slug}`}
                          className="text-[13px] font-medium text-[#0F172A] hover:text-[#5B8DEF] transition-colors duration-150 leading-tight mb-1"
                        >
                          {space.name}
                        </Link>
                        <PhaseBadge phase={space.phase} />
                      </div>

                      {/* Access cells */}
                      {PLAN_TIERS.map((tier, idx) => (
                        <AccessCell key={tier} level={access[idx] || 'None'} />
                      ))}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 px-1">
          {(['Full', 'View', 'Limited', 'None'] as AccessLevel[]).map((level) => {
            const config = ACCESS_CONFIG[level];
            const Icon = config.icon;
            return (
              <div key={level} className="flex items-center gap-1.5">
                <Icon size={14} style={{ color: config.color, opacity: level === 'None' ? 0.3 : 1 }} />
                <span className="text-[11px] text-[#94A3B8]">
                  {level === 'None' ? 'No access' : `${level} access`}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Primary User Types ──────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <SectionHeader title="Primary User Types" count={USER_TYPES.length} />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {userTypeSpaces.map(({ userType, spaces: matchedSpaces }) => (
            <UserTypeCard
              key={userType.id}
              userType={userType}
              matchedSpaces={matchedSpaces}
            />
          ))}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
