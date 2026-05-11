import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Grid3X3,
  Rocket,
  Palette,
  Database,
  Users,
  Megaphone,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Spaces', icon: Grid3X3, path: '/spaces' },
  { label: 'Launch Board', icon: Rocket, path: '/launch-board' },
  { label: 'Design Board', icon: Palette, path: '/design-board' },
  { label: 'Data Sources', icon: Database, path: '/data-sources' },
  { label: 'Roles & Plans', icon: Users, path: '/roles-plans' },
  { label: 'Claims', icon: Megaphone, path: '/claims' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-[100dvh]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[240px] flex-col bg-[#0F172A] z-40">
        {/* Logo */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
            <span className="text-[16px] font-bold text-[#F8FAFC] tracking-tight">
              AgentRoster
            </span>
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#5B8DEF]">
            Blueprint
          </span>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-[#E2E8F0]/20 mb-2" />

        {/* Nav Items */}
        <nav className="flex-1 px-3 pt-2 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] font-medium transition-all duration-150
                  ${active
                    ? 'text-[#F8FAFC] bg-[rgba(91,141,239,0.12)] border-l-[3px] border-[#5B8DEF]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.06)] border-l-[3px] border-transparent'
                  }
                `}
                style={{ paddingLeft: active ? '9px' : '12px' }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tagline */}
        <div className="px-4 pb-6 pt-4">
          <p className="text-[11px] italic text-[#94A3B8]">
            Keep your stack. Add the Brain.
          </p>
        </div>
      </aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0F172A] text-[#F8FAFC] shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="lg:hidden fixed left-0 top-0 h-full w-[280px] flex-col bg-[#0F172A] z-[60] flex"
            >
              {/* Mobile Logo + Close */}
              <div className="flex items-center justify-between px-4 pt-6 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
                    <span className="text-[16px] font-bold text-[#F8FAFC]">
                      AgentRoster
                    </span>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#5B8DEF]">
                    Blueprint
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] p-1"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mx-4 h-px bg-[#E2E8F0]/20 mb-2" />

              <nav className="flex-1 px-3 pt-2 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] font-medium transition-all duration-150
                        ${active
                          ? 'text-[#F8FAFC] bg-[rgba(91,141,239,0.12)] border-l-[3px] border-[#5B8DEF]'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.06)] border-l-[3px] border-transparent'
                        }
                      `}
                      style={{ paddingLeft: active ? '9px' : '12px' }}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="px-4 pb-6 pt-4">
                <p className="text-[11px] italic text-[#94A3B8]">
                  Keep your stack. Add the Brain.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[240px] min-h-[100dvh] bg-[#F8FAFC] overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Mobile header spacer */}
          <div className="h-10 lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
