import { useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket,
  Clock,
  AlertCircle,
  MessageSquare,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import InlineAlert from '@/components/InlineAlert';
import ProductSpaceCard from '@/components/ProductSpaceCard';
import {
  spaces,
  getBlockedSpaces,
  getSpacesNeedingDesign,
  getSpacesNeedingDev,
  getSpacesByPriority,
} from '@/data/spaces';
import Footer from '@/components/Footer';

// ── Canvas Particle Field ─────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isActive = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      offsetX: number;
      phase: number;
    }

    const particles: Particle[] = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 4,
        speedY: 0.1 + Math.random() * 0.3,
        opacity: 0.08 + Math.random() * 0.07,
        offsetX: Math.random() * 100,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let lastTime = 0;
    const fpsInterval = 1000 / 30; // throttle to ~30fps

    const animate = (time: number) => {
      if (!isActive) return;
      animationId = requestAnimationFrame(animate);

      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.y -= p.speedY;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        const oscillation = Math.sin(time / 1000 * Math.PI * 0.5 + p.phase) * 15;
        const drawX = p.x + oscillation;

        ctx.beginPath();
        ctx.arc(drawX, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91, 141, 239, ${p.opacity})`;
        ctx.fill();
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none hidden lg:block"
      style={{ width: '100%', height: '100%', zIndex: 0 }}
    />
  );
}

// ── Dashboard Page ────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();

  const p0Count = useMemo(() => getSpacesByPriority('P0').length, []);
  const p1Count = useMemo(() => getSpacesByPriority('P1').length, []);
  const blockedSpaces = useMemo(() => getBlockedSpaces(), []);
  const blockedCount = blockedSpaces.length;
  const spacesNeedingDesign = useMemo(() => getSpacesNeedingDesign(), []);
  const spacesNeedingDev = useMemo(() => getSpacesNeedingDev(), []);

  // Placeholder for claims needing proof
  const claimsNeedingProof = 5;

  const getBlockedLabel = (space: (typeof spaces)[0]): string => {
    const labels: string[] = [];
    if (space.designStatus === 'Blocked') labels.push('Design');
    if (space.devStatus === 'Blocked') labels.push('Dev');
    if (space.dataStatus === 'Blocked') labels.push('Data');
    if (space.marketingStatus === 'Blocked') labels.push('Marketing');
    return labels.join(', ') + ' Blocked';
  };

  return (
    <div className="relative">
      {/* Particle Field Background */}
      <div className="relative h-[400px] -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 lg:-mt-8 mb-8">
        <ParticleField />
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <h1 className="text-[36px] font-bold tracking-[-0.02em] text-[#0F172A] mb-1">
              Blueprint
            </h1>
            <p className="text-[14px] text-[#475569] mb-6">
              AgentRoster platform command center — internal product map
            </p>
          </motion.div>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Rocket size={32} />}
              value={p0Count}
              label="P0 Launch Spaces"
              subtext="Critical path to launch"
              accentColor="#5B8DEF"
              onClick={() => navigate('/launch-board')}
            />
            <StatCard
              icon={<Clock size={32} />}
              value={p1Count}
              label="P1 Launch Spaces"
              subtext="Next in queue"
              accentColor="#FFB347"
              onClick={() => navigate('/launch-board')}
            />
            <StatCard
              icon={<AlertCircle size={32} />}
              value={blockedCount}
              label="Blocked"
              subtext="Need immediate attention"
              accentColor="#DC2626"
              pulse={blockedCount > 0}
              onClick={() => navigate('/launch-board')}
            />
            <StatCard
              icon={<MessageSquare size={32} />}
              value={claimsNeedingProof}
              label="Unproven Claims"
              subtext="Marketing claims without evidence"
              accentColor="#DC2626"
              onClick={() => navigate('/claims')}
            />
          </div>
        </div>
      </div>

      {/* ── Section 1: Blocked Items ── */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="mb-10"
      >
        <SectionHeader
          title="Blocked Items"
          titleColor={blockedCount > 0 ? '#DC2626' : '#0F172A'}
          count={blockedCount}
          viewAllLink="/launch-board"
          viewAllLabel="Launch Board"
        />

        {blockedCount > 0 ? (
          <div className="space-y-3">
            {blockedSpaces.map((space, i) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.55 + i * 0.06 }}
              >
                <InlineAlert variant="error">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <XCircle size={16} className="text-[#DC2626] shrink-0" />
                      <button
                        onClick={() => navigate(`/spaces/${space.slug}`)}
                        className="text-[14px] font-semibold text-[#0F172A] hover:text-[#5B8DEF] transition-colors"
                      >
                        {space.name}
                      </button>
                      <span className="text-[11px] uppercase tracking-wider text-[#DC2626] font-medium">
                        {getBlockedLabel(space)}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#475569] pl-6">
                      Owner: {space.owner}
                    </div>
                  </div>
                </InlineAlert>
              </motion.div>
            ))}
          </div>
        ) : (
          <InlineAlert variant="success">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#22C55E]" />
              Nothing blocked. Smooth sailing.
            </div>
          </InlineAlert>
        )}
      </motion.section>

      {/* ── Section 2: Spaces Needing Design ── */}
      <motion.section
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="mb-10"
      >
        <SectionHeader
          title="Spaces Needing Design"
          count={spacesNeedingDesign.length}
          viewAllLink="/design-board"
          viewAllLabel="Design Board"
        />

        {spacesNeedingDesign.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {spacesNeedingDesign.map((space, i) => (
              <ProductSpaceCard key={space.id} space={space} variant="compact" index={i} />
            ))}
          </div>
        ) : (
          <InlineAlert variant="success">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#22C55E]" />
              All spaces have design coverage.
            </div>
          </InlineAlert>
        )}
      </motion.section>

      {/* ── Section 3: Spaces Needing Development ── */}
      <motion.section
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="mb-10"
      >
        <SectionHeader
          title="Spaces Needing Development"
          count={spacesNeedingDev.length}
          viewAllLink="/launch-board"
          viewAllLabel="Launch Board"
        />

        {spacesNeedingDev.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {spacesNeedingDev.map((space, i) => (
              <ProductSpaceCard key={space.id} space={space} variant="compact" index={i} />
            ))}
          </div>
        ) : (
          <InlineAlert variant="success">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#22C55E]" />
              All dev tracks are moving.
            </div>
          </InlineAlert>
        )}
      </motion.section>

      {/* ── Section 4: Claims Needing Proof ── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.95, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="mb-10"
      >
        <SectionHeader
          title="Marketing Claims Needing Proof"
          count={claimsNeedingProof}
          viewAllLink="/claims"
          viewAllLabel="Claims Map"
        />

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <div className="space-y-3">
            {[
              {
                claim: 'Keep your stack. Add the Brain.',
                space: 'Brain Connect',
                status: 'Spec Ready' as const,
              },
              {
                claim: 'The dots were always there. AgentRoster connects them.',
                space: 'AI Work Graph Audit',
                status: 'Spec Ready' as const,
              },
              {
                claim: 'Brain Build turns one conversation into your operating graph.',
                space: 'Brain Build',
                status: 'Spec Ready' as const,
              },
              {
                claim: 'Show your AI work, run client audits, publish skills, become discoverable.',
                space: 'Service Provider Network',
                status: 'Spec Ready' as const,
              },
              {
                claim: 'Run your AI Work Graph Audit. See what you have, what is missing, what is risky.',
                space: 'AI Work Graph Audit',
                status: 'Spec Ready' as const,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0 + i * 0.04 }}
                className="flex items-center gap-3 py-2 border-b border-[#E2E8F0] last:border-b-0"
              >
                <MessageSquare size={16} className="text-[#DC2626] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#0F172A] truncate">
                    {item.claim}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">{item.space}</p>
                </div>
                <span className="inline-flex items-center h-[22px] px-[10px] rounded-full text-[11px] font-medium uppercase tracking-[0.04em] border bg-red-500/[0.08] text-[#DC2626] border-red-500/20 shrink-0">
                  Needs Proof
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
