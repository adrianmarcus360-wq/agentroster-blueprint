import seedData from './seed.json';

// ── TypeScript Types ──────────────────────────────────────────────

export type StatusEnum =
  | 'Idea'
  | 'Spec Needed'
  | 'Spec Ready'
  | 'Design Needed'
  | 'Design In Progress'
  | 'Wireframe Ready'
  | 'Prototype Ready'
  | 'Dev Ready'
  | 'In Development'
  | 'QA'
  | 'Launch Ready'
  | 'Shipped'
  | 'Post-Launch Iteration'
  | 'Blocked';

export type LaunchPhase = 'Launch P0' | 'Launch P1' | 'P2' | 'Coming Soon';

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export type DataSourceStatus = 'Connected' | 'Pending' | 'Planned' | 'Mock';

export interface DataSource {
  name: string;
  type: 'API' | 'Database' | 'Integration' | 'Manual' | 'AI';
  status: DataSourceStatus;
  description: string;
}

export interface OpenQuestion {
  question: string;
  context: string;
  status: 'Open' | 'In Review' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
}

export interface MarketingClaim {
  id: string;
  claim: string;
  proofSurfaces: string[];
  status: StatusEnum;
}

export interface ProductSpace {
  id: string;
  name: string;
  slug: string;
  type: string;
  phase: LaunchPhase;
  priority: Priority;
  owner: string;
  purpose: string;
  promise: string;
  primaryUsers: string[];
  planAccess: string[];
  views: string[];
  pages: string[];
  dataSources: (string | DataSource)[];
  relatedObjects: string[];
  components: string[];
  dependencies: (number | string)[];
  designStatus: StatusEnum;
  devStatus: StatusEnum;
  dataStatus: StatusEnum;
  marketingStatus: StatusEnum;
  launchStatus: StatusEnum;
  openQuestions: OpenQuestion[];
  route: string;
  notes: string;
}

// ── Seed Data ─────────────────────────────────────────────────────

export const spaces: ProductSpace[] = seedData.spaces as ProductSpace[];
export const marketingClaims: MarketingClaim[] = seedData.marketingClaims as MarketingClaim[];

// ── Helper Functions ──────────────────────────────────────────────

export function getSpaceBySlug(slug: string): ProductSpace | undefined {
  return spaces.find((s) => s.slug === slug);
}

export function getSpacesByPhase(phase: LaunchPhase): ProductSpace[] {
  return spaces.filter((s) => s.phase === phase);
}

export function getSpacesByPriority(priority: Priority): ProductSpace[] {
  return spaces.filter((s) => s.priority === priority);
}

export function getSpacesByStatus(
  statusType: 'designStatus' | 'devStatus' | 'dataStatus' | 'marketingStatus' | 'launchStatus',
  status: StatusEnum
): ProductSpace[] {
  return spaces.filter((s) => s[statusType] === status);
}

export function getBlockedSpaces(): ProductSpace[] {
  return spaces.filter(
    (s) =>
      s.designStatus === 'Blocked' ||
      s.devStatus === 'Blocked' ||
      s.dataStatus === 'Blocked' ||
      s.marketingStatus === 'Blocked' ||
      s.launchStatus === 'Blocked'
  );
}

export function getSpacesNeedingDesign(): ProductSpace[] {
  return spaces.filter(
    (s) =>
      s.designStatus === 'Design Needed' || s.designStatus === 'Design In Progress'
  );
}

export function getSpacesNeedingDev(): ProductSpace[] {
  return spaces.filter(
    (s) => s.devStatus === 'Dev Ready' || s.devStatus === 'In Development'
  );
}

export function countByPhase(): Record<LaunchPhase, number> {
  const counts: Record<string, number> = {};
  for (const space of spaces) {
    counts[space.phase] = (counts[space.phase] || 0) + 1;
  }
  return counts as Record<LaunchPhase, number>;
}

export function countByStatus(
  statusType: 'designStatus' | 'devStatus' | 'dataStatus' | 'marketingStatus' | 'launchStatus'
): Record<StatusEnum, number> {
  const counts: Record<string, number> = {};
  for (const space of spaces) {
    const status = space[statusType];
    counts[status] = (counts[status] || 0) + 1;
  }
  return counts as Record<StatusEnum, number>;
}

// ── Status Color Map ──────────────────────────────────────────────

export const STATUS_COLORS: Record<StatusEnum, string> = {
  'Idea': '#6B7280',
  'Spec Needed': '#EF4444',
  'Spec Ready': '#F97316',
  'Design Needed': '#F59E0B',
  'Design In Progress': '#3B82F6',
  'Wireframe Ready': '#8B5CF6',
  'Prototype Ready': '#A78BFA',
  'Dev Ready': '#06B6D4',
  'In Development': '#0EA5E9',
  'QA': '#EC4899',
  'Launch Ready': '#22C55E',
  'Shipped': '#16A34A',
  'Post-Launch Iteration': '#14B8A6',
  'Blocked': '#DC2626',
};

export const PHASE_COLORS: Record<LaunchPhase, { bg: string; text: string; border: string }> = {
  'Launch P0': { bg: 'rgba(91,141,239,0.15)', text: '#5B8DEF', border: 'rgba(91,141,239,0.3)' },
  'Launch P1': { bg: 'rgba(255,179,71,0.15)', text: '#FFB347', border: 'rgba(255,179,71,0.3)' },
  'P2': { bg: 'rgba(20,184,166,0.15)', text: '#14B8A6', border: 'rgba(20,184,166,0.3)' },
  'Coming Soon': { bg: 'rgba(107,114,128,0.15)', text: '#94A3B8', border: 'rgba(107,114,128,0.3)' },
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  'P0': '#DC2626',
  'P1': '#F59E0B',
  'P2': '#3B82F6',
  'P3': '#6B7280',
};
