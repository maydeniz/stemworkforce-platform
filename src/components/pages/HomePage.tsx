// ===========================================
// Home Page — Legendary Redesign v2
// ===========================================
//
// INTERACTION DESIGN OVERHAUL:
// 1. mousemove throttled via rAF + spring interpolation
// 2. Single shared IntersectionObserver for all sections
// 3. Count-up uses easeOutExpo via rAF
// 4. Neural network auto-cycle pauses 8s after manual click
// 5. Particles use GPU-composited transform instead of left/top
// 6. Marquee pauses on hover via CSS animation-play-state
// 7. Scroll progress indicator (right rail)
// 8. Sector genome: drag-to-scroll + scroll affordance
// 9. Every section has staggered reveal on scroll entry
// 10. Keyboard navigation for network + sector cards
//
// ===========================================

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INDUSTRY_LIST, PLATFORM_STATS } from '@/config';
import { formatNumber } from '@/utils/helpers';
import { Button } from '@/components/common';
import { useDocumentTitle } from '@/hooks';

// --- SHARED INTERSECTION OBSERVER ---
type ObserverEntry = { callback: (isIntersecting: boolean, ratio: number) => void; threshold: number };
const observerMap = new Map<Element, ObserverEntry>();
let sharedObserver: IntersectionObserver | null = null;
function getSharedObserver() {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { const c = observerMap.get(entry.target); if (c) c.callback(entry.isIntersecting, entry.intersectionRatio); });
  }, { threshold: [0, 0.1, 0.15, 0.2, 0.3, 0.5, 0.75] });
  return sharedObserver;
}
function observeElement(el: Element, threshold: number, callback: (isIntersecting: boolean, ratio: number) => void) { observerMap.set(el, { callback, threshold }); getSharedObserver().observe(el); }
function unobserveElement(el: Element) { observerMap.delete(el); getSharedObserver().unobserve(el); }

// --- SCROLL REVEAL HOOK ---
const useScrollReveal = (threshold: number = 0.15) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    observeElement(el, threshold, (isIntersecting) => { if (isIntersecting) { setIsVisible(true); unobserveElement(el); } });
    return () => { if (el) unobserveElement(el); };
  }, [threshold]);
  return { ref, isVisible };
};

// --- ANIMATED COUNTER (easeOutExpo via rAF) ---
const easeOutExpo = (t: number): number => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const useCountUp = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    observeElement(el, 0.3, (isIntersecting) => { if (isIntersecting && !hasStarted) { setHasStarted(true); unobserveElement(el); } });
    return () => { if (el) unobserveElement(el); };
  }, [hasStarted]);
  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null; let rafId: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.round(easeOutExpo(progress) * target));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, target, duration]);
  return { count, ref, hasStarted };
};

// --- MOUSE PARALLAX (rAF + spring) ---
const useMouseParallax = () => {
  const tgt = useRef({ x: 0, y: 0 }); const cur = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0); const posRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => { tgt.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }; };
    const S = 0.08; const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      cur.current.x = lerp(cur.current.x, tgt.current.x, S); cur.current.y = lerp(cur.current.y, tgt.current.y, S);
      if (Math.abs(cur.current.x - posRef.current.x) > 0.001 || Math.abs(cur.current.y - posRef.current.y) > 0.001) { posRef.current = { ...cur.current }; setPosition({ ...posRef.current }); }
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true }); rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, []);
  return position;
};

// --- SCROLL PROGRESS TRACKER ---
const SECTION_IDS = ['hero', 'trust', 'features', 'network', 'sectors', 'differentiators', 'stats', 'cta'] as const;
const useScrollProgress = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const registerSection = useCallback((id: string, el: HTMLElement | null) => { if (el) sectionRefs.current.set(id, el); else sectionRefs.current.delete(id); }, []);
  useEffect(() => {
    let rafId: number;
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(() => {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(dh > 0 ? window.scrollY / dh : 0);
      const vc = window.scrollY + window.innerHeight * 0.4; let closest = 'hero'; let dist = Infinity;
      sectionRefs.current.forEach((el, id) => { const r = el.getBoundingClientRect(); const d = Math.abs(vc - (window.scrollY + r.top + r.height / 2)); if (d < dist) { dist = d; closest = id; } });
      setActiveSection(closest);
    }); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
  }, []);
  return { activeSection, scrollProgress, registerSection };
};

// --- STAKEHOLDER DATA ---
const STAKEHOLDERS = [
  { id: 'students', label: 'Students', shortLabel: 'STU', description: 'Career exploration, internship matching, interview prep, mentorship across 11 sectors.', link: '/register?role=student', color: '#06b6d4', connections: ['universities', 'talent', 'nonprofits'] },
  { id: 'talent', label: 'STEM Professionals', shortLabel: 'PRO', description: '2M+ jobs. Filter by clearance, sector, location. Salary intel and career trajectory tools.', link: '/jobs', color: '#f59e0b', connections: ['industry', 'national-labs', 'federal', 'healthcare'] },
  { id: 'industry', label: 'Industry Employers', shortLabel: 'IND', description: 'Source cleared STEM talent. Post roles, sponsor challenges, tap university pipelines.', link: '/register?role=partner', color: '#3b82f6', connections: ['talent', 'universities', 'state-workforce'] },
  { id: 'national-labs', label: 'National Labs', shortLabel: 'LAB', description: 'Fellowship management, research talent pipeline, university coordination.', link: '/partners/national-labs', color: '#22c55e', connections: ['talent', 'universities', 'federal'] },
  { id: 'universities', label: 'Universities', shortLabel: 'UNI', description: 'Graduate placement, employer relationship CRM, outcomes tracking at scale.', link: '/register?role=educator', color: '#ec4899', connections: ['students', 'industry', 'national-labs'] },
  { id: 'federal', label: 'Federal Agencies', shortLabel: 'FED', description: 'Workforce intelligence, clearance pipeline management, education coordination.', link: '/partners/government', color: '#6366f1', connections: ['talent', 'national-labs', 'state-workforce'] },
  { id: 'state-workforce', label: 'State Workforce Boards', shortLabel: 'SWB', description: 'Regional analytics, training coordination, employer engagement tools.', link: '/partners/state-workforce', color: '#14b8a6', connections: ['industry', 'federal', 'nonprofits'] },
  { id: 'healthcare', label: 'Healthcare Systems', shortLabel: 'HCS', description: 'HIPAA-compliant hiring, clinical research roles, health IT talent, credentialing.', link: '/healthcare-providers', color: '#f43f5e', connections: ['talent', 'universities', 'service-providers'] },
  { id: 'service-providers', label: 'Service Providers', shortLabel: 'SVC', description: 'List services on the marketplace, connect with orgs, grow your practice.', link: '/register?role=service-provider', color: '#a855f7', connections: ['healthcare', 'industry', 'nonprofits'] },
  { id: 'nonprofits', label: 'Workforce Nonprofits', shortLabel: 'NPO', description: 'Participant tracking, employer partnerships, outcome reporting, grant metrics.', link: '/partners/nonprofits', color: '#84cc16', connections: ['students', 'state-workforce', 'service-providers'] },
];

// --- PARTICLE FIELD (GPU transforms) ---
const ParticleField: React.FC<{ mouseX: number; mouseY: number }> = React.memo(({ mouseX, mouseY }) => {
  const particles = useMemo(() => INDUSTRY_LIST.map((ind, i) => {
    const a = (i / INDUSTRY_LIST.length) * Math.PI * 2; const r = 280 + Math.random() * 120;
    return { id: ind.id, color: ind.color, baseX: 50 + Math.cos(a) * (r / 10), baseY: 50 + Math.sin(a) * (r / 10), size: 3 + Math.random() * 3, speed: 15 + Math.random() * 25, phase: Math.random() * Math.PI * 2, pf: 0.5 + Math.random() * 1.5 };
  }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
      {particles.map((p) => <div key={p.id} className="absolute rounded-full" style={{
        width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color,
        left: `${p.baseX}%`, top: `${p.baseY}%`,
        transform: `translate3d(${mouseX * p.pf * 30}px, ${mouseY * p.pf * 30}px, 0)`,
        opacity: 0.4, boxShadow: `0 0 ${p.size * 4}px ${p.color}40`,
        animation: `orbitParticle ${p.speed}s ease-in-out infinite`, animationDelay: `${p.phase}s`, willChange: 'transform',
      }} />)}
    </div>
  );
});
ParticleField.displayName = 'ParticleField';

// --- NETWORK NODE (click ripple + keyboard) ---
const NetworkNode: React.FC<{
  stakeholder: typeof STAKEHOLDERS[0]; x: number; y: number; isActive: boolean; isConnected: boolean; onClick: () => void; index: number; isVisible: boolean;
}> = ({ stakeholder, x, y, isActive, isConnected, onClick, index, isVisible }) => {
  const [ripple, setRipple] = useState(false);
  const fire = () => { setRipple(true); onClick(); setTimeout(() => setRipple(false), 600); };
  return (
    <button onClick={fire} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } }}
      className="absolute group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d14] rounded-full"
      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.6})`, opacity: isVisible ? 1 : 0,
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s` }}
      aria-label={`Select ${stakeholder.label}`} role="option" aria-selected={isActive} tabIndex={0}>
      <div className="absolute inset-0 rounded-full" style={{ transform: `scale(${isActive ? 2.2 : 1.8})`, backgroundColor: `${stakeholder.color}${isActive ? '12' : '04'}`, border: `1px solid ${stakeholder.color}${isActive ? '30' : '00'}`, transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', animation: isActive ? 'nodeBreath 3s ease-in-out infinite' : 'none' }} />
      {ripple && <div className="absolute inset-0 rounded-full pointer-events-none" style={{ backgroundColor: `${stakeholder.color}20`, animation: 'nodeRipple 0.6s cubic-bezier(0,0,0.2,1) forwards' }} />}
      <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer" style={{
        backgroundColor: isActive ? `${stakeholder.color}25` : isConnected ? `${stakeholder.color}12` : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${isActive ? stakeholder.color : isConnected ? `${stakeholder.color}50` : 'rgba(255,255,255,0.08)'}`,
        boxShadow: isActive ? `0 0 30px ${stakeholder.color}20, inset 0 0 20px ${stakeholder.color}10` : isConnected ? `0 0 15px ${stakeholder.color}08` : 'none',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', transform: isActive ? 'scale(1.1)' : 'scale(1)',
      }}>
        <span className="font-mono text-[10px] md:text-xs font-bold tracking-wider select-none" style={{ color: isActive || isConnected ? stakeholder.color : 'rgba(255,255,255,0.3)', transition: 'color 0.4s ease' }}>{stakeholder.shortLabel}</span>
      </div>
      <div className="absolute top-full mt-1 md:mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ opacity: isActive ? 1 : 0.7, transform: `translateY(${isActive ? 0 : 4}px)`, transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
        <span className="hidden sm:inline text-[10px] md:text-xs font-medium" style={{ color: isActive ? stakeholder.color : 'rgba(255,255,255,0.6)' }}>{stakeholder.label}</span>
        <span className="sm:hidden text-[8px] font-medium" style={{ color: isActive ? stakeholder.color : 'rgba(255,255,255,0.5)' }}>{stakeholder.shortLabel}</span>
      </div>
    </button>
  );
};

// --- SVG CONNECTION LINES (animated dash) ---
const ConnectionLines: React.FC<{ activeId: string | null; nodePositions: { id: string; x: number; y: number; color: string; connections: string[] }[]; isVisible: boolean }> = React.memo(({ activeId, nodePositions, isVisible }) => {
  if (!isVisible) return null;
  const lines: { x1: number; y1: number; x2: number; y2: number; active: boolean; color: string; key: string }[] = [];
  const rendered = new Set<string>();
  nodePositions.forEach((node) => { node.connections.forEach((tid) => {
    const key = [node.id, tid].sort().join('-'); if (rendered.has(key)) return; rendered.add(key);
    const t = nodePositions.find((n) => n.id === tid); if (!t) return;
    const act = activeId === node.id || activeId === tid;
    lines.push({ x1: node.x, y1: node.y, x2: t.x, y2: t.y, active: act, color: act ? (activeId === node.id ? node.color : t.color) : 'rgba(255,255,255,0.04)', key });
  }); });
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>{nodePositions.map((n) => <linearGradient key={`g-${n.id}`} id={`lg-${n.id}`}><stop offset="0%" stopColor={n.color} stopOpacity="0.6" /><stop offset="100%" stopColor={n.color} stopOpacity="0.1" /></linearGradient>)}</defs>
      {lines.map((l) => <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={l.active ? 0.2 : 0.05} strokeDasharray={l.active ? '0.5 0.3' : 'none'} style={{ transition: 'stroke 0.5s ease, stroke-width 0.5s ease, opacity 0.5s ease', opacity: l.active ? 1 : 0.6, animation: l.active ? 'connectionFlow 2s linear infinite' : 'none' }} />)}
    </svg>
  );
});
ConnectionLines.displayName = 'ConnectionLines';

// --- SECTOR CARD (enhanced hover + keyboard) ---
const SectorCard: React.FC<{ industry: typeof INDUSTRY_LIST[0]; index: number; isVisible: boolean }> = ({ industry, index, isVisible }) => {
  const [h, setH] = useState(false);
  return (
    <Link to={`/jobs?sector=${industry.id}`} className="flex-shrink-0 w-[280px] md:w-[320px] relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded-2xl"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onFocus={() => setH(true)} onBlur={() => setH(false)}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s` }}>
      <div className="relative h-full p-7 rounded-2xl border overflow-hidden" style={{
        backgroundColor: h ? `${industry.color}10` : 'rgba(255,255,255,0.035)', borderColor: h ? `${industry.color}30` : 'rgba(255,255,255,0.08)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', transform: h ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)', boxShadow: h ? `0 20px 40px -10px ${industry.color}15` : 'none',
      }}>
        <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(circle at 30% 20%, ${industry.color}08 0%, transparent 60%)`, opacity: h ? 1 : 0, transition: 'opacity 0.5s ease' }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${industry.color}15`, transition: 'transform 0.3s ease', transform: h ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)' }}>{industry.icon}</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ color: industry.color, backgroundColor: `${industry.color}10`, transition: 'transform 0.3s ease', transform: h ? 'scale(1.05)' : 'scale(1)' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>{industry.growth}%
            </div>
          </div>
          <h3 className="text-base font-semibold text-white mb-2">{industry.name}</h3>
          <p className="text-[13px] text-gray-400 leading-relaxed mb-5 line-clamp-2">{industry.description}</p>
          <div className="relative">
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Open Roles</span><span className="text-sm font-bold tabular-nums" style={{ color: industry.color }}>{formatNumber(industry.jobsCount)}</span></div>
            <div className="h-[3px] rounded-full bg-white/[0.04] overflow-hidden"><div className="h-full rounded-full" style={{
              width: h ? `${Math.min((industry.jobsCount / 900000) * 100, 100)}%` : `${Math.min((industry.jobsCount / 900000) * 100, 100) * 0.7}%`,
              backgroundColor: industry.color, opacity: h ? 0.8 : 0.5, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
            }} /></div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.04]" style={{ opacity: h ? 1 : 0.6, transition: 'opacity 0.4s ease' }}>
            <div className="flex items-center gap-2 overflow-hidden"><span className="text-[11px] text-gray-500 flex-shrink-0">Top:</span>
              <div className="flex items-center gap-1.5 overflow-hidden">{industry.topEmployers.slice(0, 3).map((emp, ei) => <span key={emp} className="text-[11px] text-gray-400 px-1.5 py-0.5 rounded bg-white/[0.06] whitespace-nowrap" style={{ transform: h ? 'translateX(0)' : `translateX(${ei * 4}px)`, opacity: h ? 1 : 0.7, transition: `transform 0.4s ease ${ei * 0.05}s, opacity 0.3s ease ${ei * 0.05}s` }}>{emp}</span>)}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: industry.color, opacity: h ? 1 : 0, transform: h ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s' }}>
            View open roles <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- SCROLL PROGRESS INDICATOR ---
const ScrollProgressIndicator: React.FC<{ activeSection: string; scrollProgress: number }> = React.memo(({ activeSection, scrollProgress }) => {
  const labels: Record<string, string> = { hero: 'Top', trust: 'Partners', features: 'Features', network: 'Network', sectors: 'Sectors', differentiators: 'Platform', stats: 'Stats', cta: 'Join' };
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-end gap-3" role="navigation" aria-label="Page sections">
      <div className="absolute right-[3px] top-0 bottom-0 w-px bg-white/[0.06]"><div className="w-full bg-gradient-to-b from-indigo-500 to-purple-500 origin-top" style={{ height: `${scrollProgress * 100}%`, transition: 'height 0.15s ease-out' }} /></div>
      {SECTION_IDS.map((id) => (
        <a key={id} href={`#section-${id}`} className="relative group flex items-center gap-3" aria-label={`Go to ${labels[id]} section`} aria-current={activeSection === id ? 'true' : undefined}
          onClick={(e) => { e.preventDefault(); document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
          <span className="text-[10px] font-medium uppercase tracking-wider whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" style={{ color: activeSection === id ? '#a5b4fc' : 'rgba(255,255,255,0.3)' }}>{labels[id]}</span>
          <div className="w-[7px] h-[7px] rounded-full relative z-10 transition-all duration-300" style={{ backgroundColor: activeSection === id ? '#6366f1' : 'rgba(255,255,255,0.15)', boxShadow: activeSection === id ? '0 0 8px rgba(99,102,241,0.4)' : 'none', transform: activeSection === id ? 'scale(1.4)' : 'scale(1)' }} />
        </a>
      ))}
    </div>
  );
});
ScrollProgressIndicator.displayName = 'ScrollProgressIndicator';

// --- REVEAL SECTION WRAPPER ---
const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  return <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
};

// ===========================================
// MAIN COMPONENT
// ===========================================
const HomePage: React.FC = () => {
  useDocumentTitle("Where America Builds Its Technical Future | STEMWorkforce");
  const mouse = useMouseParallax();
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const activeStakeholder = STAKEHOLDERS.find((s) => s.id === activeNode);
  const { activeSection, scrollProgress, registerSection } = useScrollProgress();
  const networkReveal = useScrollReveal(0.1); const sectorReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.2); const ctaReveal = useScrollReveal(0.15);
  const jobsCounter = useCountUp(PLATFORM_STATS.totalJobs, 2500); const statesCounter = useCountUp(PLATFORM_STATS.statesCovered, 1500);
  const sectorsCounter = useCountUp(11, 1000); const employersCounter = useCountUp(PLATFORM_STATS.activeEmployers, 2000);
  const nodePositions = useMemo(() => [
    { ...STAKEHOLDERS[0], x: 18, y: 22 }, { ...STAKEHOLDERS[1], x: 50, y: 15 }, { ...STAKEHOLDERS[2], x: 82, y: 22 },
    { ...STAKEHOLDERS[3], x: 12, y: 50 }, { ...STAKEHOLDERS[4], x: 35, y: 45 }, { ...STAKEHOLDERS[5], x: 65, y: 45 },
    { ...STAKEHOLDERS[6], x: 88, y: 50 }, { ...STAKEHOLDERS[7], x: 22, y: 78 }, { ...STAKEHOLDERS[8], x: 50, y: 82 }, { ...STAKEHOLDERS[9], x: 78, y: 78 },
  ], []);
  // Mobile: tighter circular layout for small screens
  const mobileNodePositions = useMemo(() => {
    const cx = 50, cy = 50, r = 38;
    return STAKEHOLDERS.map((s, i) => {
      const angle = (i / STAKEHOLDERS.length) * Math.PI * 2 - Math.PI / 2;
      return { ...s, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    });
  }, []);

  // Auto-cycle with 8s manual override grace
  const [autoCycleIndex, setAutoCycleIndex] = useState(0);
  const [manualOverrideUntil, setManualOverrideUntil] = useState(0);
  useEffect(() => {
    if (activeNode) return;
    if (Date.now() < manualOverrideUntil) { const r = manualOverrideUntil - Date.now(); const t = setTimeout(() => setAutoCycleIndex((i) => (i + 1) % STAKEHOLDERS.length), r); return () => clearTimeout(t); }
    const t = setInterval(() => setAutoCycleIndex((i) => (i + 1) % STAKEHOLDERS.length), 3500);
    return () => clearInterval(t);
  }, [activeNode, manualOverrideUntil]);
  const handleNodeClick = useCallback((id: string) => { setActiveNode((prev) => { if (prev === id) { setManualOverrideUntil(Date.now() + 8000); return null; } return id; }); }, []);
  const handleNetworkKeyDown = useCallback((e: React.KeyboardEvent) => { if (e.key === 'Escape') { setActiveNode(null); setManualOverrideUntil(Date.now() + 8000); } }, []);

  // Sector drag-to-scroll
  const sectorScrollRef = useRef<HTMLDivElement>(null); const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 }); const [showScrollHint, setShowScrollHint] = useState(true);
  const onSectorDown = useCallback((e: React.MouseEvent) => { const c = sectorScrollRef.current; if (!c) return; setIsDragging(true); setDragStart({ x: e.pageX, scrollLeft: c.scrollLeft }); setShowScrollHint(false); }, []);
  const onSectorMove = useCallback((e: React.MouseEvent) => { if (!isDragging) return; const c = sectorScrollRef.current; if (!c) return; e.preventDefault(); c.scrollLeft = dragStart.scrollLeft - (e.pageX - dragStart.x) * 1.5; }, [isDragging, dragStart]);
  const onSectorUp = useCallback(() => setIsDragging(false), []);
  useEffect(() => { const c = sectorScrollRef.current; if (!c) return; const fn = () => setShowScrollHint(false); c.addEventListener('scroll', fn, { passive: true, once: true }); return () => c.removeEventListener('scroll', fn); }, []);

  return (
    <div className="relative bg-[#0a0a0f]">
      <style>{`
        @keyframes orbitParticle { 0%,100%{transform:translate3d(0,0,0) scale(1);opacity:.3} 25%{transform:translate3d(15px,-25px,0) scale(1.2);opacity:.5} 50%{transform:translate3d(-10px,15px,0) scale(.8);opacity:.2} 75%{transform:translate3d(20px,10px,0) scale(1.1);opacity:.4} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes textReveal { 0%{opacity:0;transform:translateY(40px);filter:blur(10px)} 100%{opacity:1;transform:translateY(0);filter:blur(0)} }
        @keyframes fadeInUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{opacity:.4} 50%{opacity:.8} }

        @keyframes gridPulse { 0%,100%{opacity:.02} 50%{opacity:.05} }
        @keyframes nodeBreath { 0%,100%{transform:scale(2.2);opacity:.8} 50%{transform:scale(2.5);opacity:.5} }
        @keyframes nodeRipple { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(3);opacity:0} }
        @keyframes connectionFlow { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-1.6} }
        @keyframes scrollHint { 0%,100%{transform:translateX(0);opacity:.6} 50%{transform:translateX(12px);opacity:1} }
        .text-reveal{animation:textReveal 1s cubic-bezier(.16,1,.3,1) forwards}
        .text-reveal-d1{animation:textReveal 1s cubic-bezier(.16,1,.3,1) .15s forwards;opacity:0}
        .text-reveal-d2{animation:textReveal 1s cubic-bezier(.16,1,.3,1) .3s forwards;opacity:0}
        .text-reveal-d3{animation:textReveal 1s cubic-bezier(.16,1,.3,1) .5s forwards;opacity:0}
        .sector-scroll-container{cursor:grab} .sector-scroll-container:active{cursor:grabbing}
        .sector-scroll-container.is-dragging{cursor:grabbing;user-select:none}
        @media(prefers-reduced-motion:reduce){.text-reveal,.text-reveal-d1,.text-reveal-d2,.text-reveal-d3{animation:none!important;opacity:1!important}}
      `}</style>

      <ScrollProgressIndicator activeSection={activeSection} scrollProgress={scrollProgress} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={(el) => { if (el) registerSection('hero', el); }} id="section-hero">
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute inset-0 bg-grid-pattern" style={{ animation: 'gridPulse 8s ease-in-out infinite' }} />
        <div className="absolute w-[700px] h-[700px] rounded-full blur-[150px] opacity-20 will-change-transform" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)', transform: `translate3d(${mouse.x * 40}px, ${mouse.y * 25}px, 0)`, left: '30%', top: '30%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.15] will-change-transform" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', transform: `translate3d(${mouse.x * -25}px, ${mouse.y * -20}px, 0)`, right: '20%', bottom: '25%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-10 will-change-transform" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)', transform: `translate3d(${mouse.x * 20}px, ${mouse.y * 15}px, 0)`, left: '60%', top: '60%' }} />
        <ParticleField mouseX={mouse.x} mouseY={mouse.y} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]"><div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" style={{ animation: 'scanline 8s linear infinite' }} /></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-reveal-d1 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-10 backdrop-blur-sm">
            <div className="relative"><div className="w-2 h-2 rounded-full bg-emerald-400" /><div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} /></div>
            <span className="text-[11px] font-medium text-gray-400 tracking-[0.15em] uppercase">Now live across all 50 states</span>
          </div>
          <h1 className="mb-8">
            <span className="text-reveal block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.92]"><span className="gradient-text">Where America</span></span>
            <span className="text-reveal-d1 block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.92] mt-2"><span className="gradient-text">Builds Its</span></span>
            <span className="text-reveal-d2 block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.92] mt-2"><span className="text-white">Technical Future</span></span>
          </h1>
          <p className="text-reveal-d2 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed font-light">The workforce platform for 11 critical technology sectors. Connecting talent, employers, national labs, universities, and federal agencies in one place.</p>
          <div className="text-reveal-d3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 py-4 group/cta" onClick={() => navigate('/jobs')}><span>Search STEM Roles</span><svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-4" onClick={() => navigate('/register?role=partner')}>Bring Your Organization</Button>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 hover:opacity-60 transition-opacity duration-500">
            <span className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-medium">Discover</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-600 via-gray-700 to-transparent relative overflow-hidden"><div className="absolute w-px h-3 bg-gradient-to-b from-indigo-400 to-transparent" style={{ animation: 'scanline 2s ease-in-out infinite' }} /></div>
          </div>
        </div>
      </section>

      {/* BUILT FOR — ORGANIZATION CATEGORIES */}
      <section className="relative py-20 md:py-28 bg-[#0d0d14] border-y border-white/[0.08] overflow-hidden" ref={(el) => { if (el) registerSection('trust', el); }} id="section-trust">
        <div className="absolute inset-0 pointer-events-none"><div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-3xl" /><div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/[0.02] rounded-full blur-3xl" /></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection><div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5"><div className="w-8 h-px bg-blue-500/40" /><span className="text-[11px] font-semibold text-blue-400/70 uppercase tracking-[0.2em]">Who We Serve</span><div className="w-8 h-px bg-blue-500/40" /></div>
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">Built for the organizations shaping<br /><span className="gradient-text">critical technologies.</span></h2>
          </div></RevealSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { name: 'National Labs', icon: '⚛️', color: '#22c55e' },
              { name: 'Defense & Intel', icon: '🛡️', color: '#6366f1' },
              { name: 'Federal Agencies', icon: '🏛️', color: '#3b82f6' },
              { name: 'Universities', icon: '🎓', color: '#ec4899' },
              { name: 'Healthcare', icon: '🏥', color: '#f43f5e' },
              { name: 'Fortune 500', icon: '🏢', color: '#f59e0b' },
              { name: 'Startups', icon: '🚀', color: '#06b6d4' },
            ].map((org, i) => (
              <RevealSection key={org.name} delay={i * 0.06}>
                <div className="group relative flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border transition-all duration-500 cursor-default hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.08))', borderColor: 'rgba(99,102,241,0.15)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(139,92,246,0.14))'; e.currentTarget.style.borderColor = `${org.color}35`; e.currentTarget.style.boxShadow = `0 8px 40px ${org.color}12, 0 0 0 1px ${org.color}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.08))'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(99,102,241,0.12)' }}>
                    <span className="text-2xl" role="img" aria-hidden="true">{org.icon}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 text-center leading-tight">{org.name}</span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full transition-all duration-500 group-hover:w-12 opacity-0 group-hover:opacity-100" style={{ backgroundColor: org.color }} />
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection delay={0.5}><div className="flex flex-wrap justify-center gap-2.5 mt-10">
            {['Semiconductor Fabs','Quantum Computing','Aerospace & Space','Clean Energy','Biotech & Pharma','Cybersecurity','Workforce Nonprofits'].map((sub) => (
              <span key={sub} className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] text-gray-400 font-medium tracking-wide hover:border-white/[0.12] hover:text-gray-300 transition-all duration-300 cursor-default">+ {sub}</span>
            ))}
          </div></RevealSection>
        </div>
      </section>

      {/* WHAT YOU CAN DO HERE */}
      <section className="py-28 md:py-36 bg-[#0a0a0f] relative overflow-hidden" ref={(el) => { if (el) registerSection('features', el); }} id="section-features">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection><div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6"><div className="w-8 h-px bg-indigo-500/40" /><span className="text-[11px] font-semibold text-indigo-400/70 uppercase tracking-[0.2em]">Platform</span><div className="w-8 h-px bg-indigo-500/40" /></div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.05]">What You Can Do Here</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">Tools for every stakeholder — whether you&#39;re hiring, job searching, placing graduates, or consulting.</p>
          </div></RevealSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Jobs & Internships', desc: 'Search thousands of aggregated STEM roles across all 50 states. Filter by sector, clearance level, and specialization.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />, rgb: '59,130,246', route: '/jobs' },
              { title: 'Workforce Map', desc: 'Interactive intelligence across all 50 states. See where STEM talent lives, where employers are hiring, and where the gaps are.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />, rgb: '16,185,129', route: '/workforce-map' },
              { title: 'Training Portal', desc: 'Access upskilling programs, certifications, and professional development tailored to critical technology sectors.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />, rgb: '245,158,11', route: '/training' },
              { title: 'Events', desc: 'Career fairs, webinars, workshops, and networking events connecting talent with employers across all STEM sectors.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />, rgb: '236,72,153', route: '/events' },
              { title: 'Partner Network', desc: 'Connect with national labs, universities, federal agencies, and industry leaders building the STEM workforce together.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />, rgb: '139,92,246', route: '/partners' },
              { title: 'Innovation Hub', desc: 'Challenges, competitions, and project showcases where talent demonstrates skills and organizations discover solutions.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />, rgb: '234,88,12', route: '/projects' },
            ].map((feature, idx) => (
              <RevealSection key={feature.title} delay={idx * 0.08}><div className="relative p-7 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:bg-white/[0.05] transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(feature.route)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(${feature.rgb},0.25)`; e.currentTarget.style.boxShadow = `0 16px 40px -8px rgba(${feature.rgb},0.1)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to bottom right, rgba(${feature.rgb},0.04), transparent)` }} />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `rgba(${feature.rgb},0.1)` }}>
                    <svg className="w-5 h-5" style={{ color: `rgb(${feature.rgb})` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{feature.icon}</svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 leading-tight">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                  <div className="flex items-center gap-1.5 mt-5 text-sm font-medium transition-colors duration-300" style={{ color: `rgb(${feature.rgb})` }}>
                    <span>Explore</span><svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </div>
                </div>
              </div></RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* NERVE CENTER */}
      <section className="py-24 md:py-36 bg-[#0d0d14] relative overflow-hidden" ref={(el) => { (networkReveal.ref as React.MutableRefObject<HTMLElement | null>).current = el; if (el) registerSection('network', el); }} id="section-network">
        <div className="absolute inset-0 pointer-events-none"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.04] bg-blue-500" /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection><div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-6"><div className="w-8 h-px bg-blue-500/40" /><span className="text-[11px] font-semibold text-blue-400/70 uppercase tracking-[0.2em]">The Network</span><div className="w-8 h-px bg-blue-500/40" /></div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.05]">Ten Roles.{' '}<span className="gradient-text">One Network.</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base"><span className="hidden sm:inline">Select</span><span className="sm:hidden">Tap</span> a node to see how each stakeholder connects.{!activeNode && <span className="block mt-2 text-xs text-gray-600 italic">Auto-cycling. <span className="hidden sm:inline">Click</span><span className="sm:hidden">Tap</span> any node to explore.</span>}</p>
          </div></RevealSection>
          {/* Desktop network */}
          <div className="hidden lg:block" role="listbox" aria-label="Stakeholder network" onKeyDown={handleNetworkKeyDown}>
            <div className="relative mx-auto" style={{ maxWidth: '900px', aspectRatio: '16/10' }}>
              <ConnectionLines activeId={activeNode || STAKEHOLDERS[autoCycleIndex]?.id} nodePositions={nodePositions} isVisible={networkReveal.isVisible} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"><div className="w-20 h-20 rounded-full border border-white/[0.04] flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}><span className="text-[9px] font-bold text-gray-600 tracking-widest uppercase">STEM</span></div></div>
              {nodePositions.map((n, i) => { const aid = activeNode || STAKEHOLDERS[autoCycleIndex]?.id; const ac = STAKEHOLDERS.find(s => s.id === aid); return <NetworkNode key={n.id} stakeholder={n} x={n.x} y={n.y} isActive={aid === n.id} isConnected={ac?.connections.includes(n.id) || false} onClick={() => handleNodeClick(n.id)} index={i} isVisible={networkReveal.isVisible} />; })}
            </div>
          </div>
          {/* Mobile/tablet network — circular layout */}
          <div className="lg:hidden" role="listbox" aria-label="Stakeholder network" onKeyDown={handleNetworkKeyDown}>
            <div className="relative mx-auto" style={{ maxWidth: '400px', aspectRatio: '1/1' }}>
              <ConnectionLines activeId={activeNode || STAKEHOLDERS[autoCycleIndex]?.id} nodePositions={mobileNodePositions} isVisible={networkReveal.isVisible} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"><div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/[0.04] flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }}><span className="text-[8px] sm:text-[9px] font-bold text-gray-600 tracking-widest uppercase">STEM</span></div></div>
              {mobileNodePositions.map((n, i) => { const aid = activeNode || STAKEHOLDERS[autoCycleIndex]?.id; const ac = STAKEHOLDERS.find(s => s.id === aid); return <NetworkNode key={n.id} stakeholder={n} x={n.x} y={n.y} isActive={aid === n.id} isConnected={ac?.connections.includes(n.id) || false} onClick={() => handleNodeClick(n.id)} index={i} isVisible={networkReveal.isVisible} />; })}
            </div>
          </div>
          {/* Shared detail card */}
          <div className="mt-6 md:mt-8 max-w-2xl mx-auto">{(() => { const d = activeStakeholder || STAKEHOLDERS[autoCycleIndex]; if (!d) return null; return (
            <div className="p-5 md:p-7 rounded-2xl border bg-white/[0.02] text-center" style={{ borderColor: `${d.color}15`, transition: 'border-color 0.5s ease' }} key={d.id}>
              <div className="inline-flex items-center gap-2 mb-3 md:mb-4"><span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: d.color, backgroundColor: `${d.color}10` }}>{d.connections.length} connections</span></div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">{d.label}</h3><p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-5 leading-relaxed">{d.description}</p>
              <Button variant="outline" size="sm" className="group/btn" onClick={() => navigate(d.link)}><span>Get Started</span><svg className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></Button>
            </div>); })()}</div>
        </div>
      </section>

      {/* SECTOR GENOME */}
      <section className="py-24 md:py-36 bg-[#0a0a0f] relative" ref={(el) => { (sectorReveal.ref as React.MutableRefObject<HTMLElement | null>).current = el; if (el) registerSection('sectors', el); }} id="section-sectors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><RevealSection>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-6"><div className="w-8 h-px bg-emerald-500/40" /><span className="text-[11px] font-semibold text-emerald-400/70 uppercase tracking-[0.2em]">The Sectors</span><div className="w-8 h-px bg-emerald-500/40" /></div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">11 Sectors.<br /><span className="gradient-text">Shaping Everything.</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed mt-5">From nuclear energy to quantum computing — explore the industries driving America&#39;s technical future.</p>
            <Link to="/jobs" className="inline-flex items-center gap-2 mt-5 text-sm text-blue-400 hover:text-blue-300 transition-colors group font-medium">View all sectors <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></Link>
          </div>
        </RevealSection></div>
        <div className="relative">
          <div ref={sectorScrollRef} className={`overflow-x-auto scrollbar-hide sector-scroll-container ${isDragging ? 'is-dragging' : ''}`} onMouseDown={onSectorDown} onMouseMove={onSectorMove} onMouseUp={onSectorUp} onMouseLeave={onSectorUp}>
            <div className="flex gap-5 px-4 sm:px-6 lg:px-8 pb-6" style={{ minWidth: 'max-content' }}>{INDUSTRY_LIST.map((ind, i) => <SectorCard key={ind.id} industry={ind} index={i} isVisible={sectorReveal.isVisible} />)}</div>
          </div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent pointer-events-none" /><div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0a0a0f] to-transparent pointer-events-none" />
          {showScrollHint && sectorReveal.isVisible && <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Scroll</span><svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: 'scrollHint 2s ease-in-out infinite' }}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5" /></svg></div>}
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-24 md:py-36 bg-[#0d0d14] relative overflow-hidden" ref={(el) => { if (el) registerSection('differentiators', el); }} id="section-differentiators">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection><div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6"><div className="w-8 h-px bg-purple-500/40" /><span className="text-[11px] font-semibold text-purple-400/70 uppercase tracking-[0.2em]">Built Different</span><div className="w-8 h-px bg-purple-500/40" /></div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.05]">Infrastructure,<br /><span className="gradient-text">Not a Job Board.</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">General hiring platforms treat nuclear engineers and retail managers the same way. This platform was built from day one for the sectors that determine whether America leads or follows.</p>
          </div></RevealSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Row 1: Cleared Talent (2 cols) + First Internship (1 col, right) */}
            <RevealSection delay={0} className="md:col-span-2 lg:col-span-2"><div className="relative p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:border-blue-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative"><div className="flex items-start justify-between mb-8"><div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"><svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg></div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Cleared Talent, Surfaced Instantly.</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-lg">Filter candidates by Public Trust, Secret, TS/SCI, and Q Clearance. Build talent pipelines from university programs with active clearance tracks. No other hiring platform treats clearance as a first-class search dimension.</p>
              </div></div>
              <div className="flex flex-wrap gap-2">{[{ label: 'Public Trust', color: '#3b82f6' },{ label: 'Secret', color: '#f59e0b' },{ label: 'Top Secret', color: '#ef4444' },{ label: 'TS/SCI', color: '#7c3aed' },{ label: 'Q Clearance', color: '#22c55e' }].map((t, ti) => <span key={t.label} className="px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-300 group-hover:scale-105" style={{ color: `${t.color}cc`, backgroundColor: `${t.color}10`, border: `1px solid ${t.color}15`, transitionDelay: `${ti * 0.03}s` }}>{t.label}</span>)}</div></div>
            </div></RevealSection>
            <RevealSection delay={0.08}><div className="relative p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:border-emerald-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-1 h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative flex-1 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"><svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg></div>
                <h3 className="text-xl font-bold text-white mb-3">From First Internship to Lab Director.</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">Most platforms serve one career moment. This one covers the entire arc &#8212; a high school student exploring STEM, a college junior landing a DOE internship, a mid-career engineer crossing into quantum.</p>
                <div className="flex items-center gap-1">{['Explore','Learn','Intern','Launch','Lead'].map((st, i) => <React.Fragment key={st}><span className="text-[9px] font-semibold text-emerald-400/50 uppercase tracking-wider group-hover:text-emerald-400/90 transition-colors duration-300" style={{ transitionDelay: `${i * 0.05}s` }}>{st}</span>{i < 4 && <svg className="w-3 h-3 text-emerald-500/20 flex-shrink-0 group-hover:text-emerald-500/60 transition-colors duration-300" style={{ transitionDelay: `${i * 0.05}s` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>}</React.Fragment>)}</div>
              </div>
            </div></RevealSection>

            {/* Row 2: See Workforce Map (full width) */}
            <RevealSection delay={0.16} className="md:col-span-2 lg:col-span-3"><div className="relative p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:border-purple-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"><svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg></div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">See the Entire Workforce. Live.</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">Interactive maps across all 50 states. Real-time labor market data for every sector. Talent supply vs. employer demand, by region, by clearance level, by specialization.</p>
                </div>
                <Link to="/map" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/15 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/15 hover:border-purple-500/25 transition-all duration-300 flex-shrink-0 group/link">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>
                  <span>Explore Map</span>
                  <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </div>
            </div></RevealSection>

            {/* Row 3: Healthcare (full width, centered) */}
            <RevealSection delay={0.24} className="md:col-span-2 lg:col-span-3"><div className="relative p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] group hover:border-cyan-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-8 max-w-4xl mx-auto">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"><svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg></div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Healthcare STEM Integration</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{formatNumber(PLATFORM_STATS.healthcareJobs)} healthcare technology roles. HIPAA-compliant workflows, clinical research matching, health IT credentialing, and cross-sector biotech pipelines.</p>
                </div>
                <div className="flex flex-wrap gap-2 md:max-w-[240px] flex-shrink-0">{['Health IT','Clinical Research','Medical Devices','Telemedicine','Healthcare AI','Biomedical Eng.'].map((t, ti) => <span key={t} className="px-2.5 py-1 text-[10px] font-medium text-cyan-400/70 bg-cyan-500/[0.08] rounded-md border border-cyan-500/10 transition-all duration-300 group-hover:bg-cyan-500/[0.12] group-hover:border-cyan-500/20" style={{ transitionDelay: `${ti * 0.03}s` }}>{t}</span>)}</div>
              </div>
            </div></RevealSection>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 md:py-32 bg-[#0a0a0f] relative overflow-hidden" ref={(el) => { (statsReveal.ref as React.MutableRefObject<HTMLElement | null>).current = el; if (el) registerSection('stats', el); }} id="section-stats">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" /><div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection><div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6"><div className="relative"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} /></div><span className="text-[11px] font-semibold text-emerald-400/70 uppercase tracking-[0.2em]">Live Aggregation</span></div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1]">Already Aggregating.</h2>
          </div></RevealSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.04]" style={{ opacity: statsReveal.isVisible ? 1 : 0, transform: statsReveal.isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
            {[{ ref: jobsCounter.ref, value: formatNumber(jobsCounter.count), suffix: '+', label: 'STEM Roles Indexed', sublabel: 'From public databases', color: '#6366f1' },
              { ref: statesCounter.ref, value: statesCounter.count === 50 ? 'All 50' : String(statesCounter.count), suffix: '', label: 'States. Every Sector.', sublabel: 'Coast to coast', color: '#22c55e' },
              { ref: sectorsCounter.ref, value: String(sectorsCounter.count), suffix: '', label: 'Critical Technology Sectors', sublabel: 'Aligned with federal priorities', color: '#f59e0b' },
              { ref: employersCounter.ref, value: formatNumber(employersCounter.count), suffix: '+', label: 'Organizations', sublabel: 'And growing daily', color: '#ec4899' }].map((s, i) => (
              <div key={i} ref={s.ref} className="relative p-8 md:p-10 bg-white/[0.03] text-center group hover:bg-white/[0.03] transition-all duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-1/2 transition-all duration-500" style={{ backgroundColor: `${s.color}40` }} />
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums mb-3 tracking-tight">{s.value}{s.suffix}</div>
                <div className="text-sm font-medium text-gray-300 mb-1">{s.label}</div><div className="text-[11px] text-gray-600">{s.sublabel}</div>
              </div>))}
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-8 tracking-wide">Aligned with federal STEM workforce priorities. Updated continuously.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-36 bg-[#0d0d14] relative overflow-hidden" ref={(el) => { (ctaReveal.ref as React.MutableRefObject<HTMLElement | null>).current = el; if (el) registerSection('cta', el); }} id="section-cta">
        <div className="absolute inset-0 pointer-events-none"><div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/[0.02] to-transparent" /><div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/[0.02] to-transparent" /></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ opacity: ctaReveal.isVisible ? 1 : 0, transform: ctaReveal.isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
          <RevealSection><div className="text-center mb-16"><h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.05]">One Platform.<br /><span className="gradient-text">Every Stakeholder.</span></h2><p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">From students exploring STEM to agencies filling critical roles — here&#39;s what STEMWorkforce does for you.</p></div></RevealSection>

          {/* VALUE PROPOSITION CARDS — 5 stakeholder groups */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {([
              { label: 'For Students', rgb: '6,182,212', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />,
                headline: 'Find the right college. Land the right internship.',
                bullets: ['AI-powered college matching for STEM programs', 'Scholarship search across 11 critical sectors', 'Resume builder and interview prep designed for STEM careers'],
                cta: 'Explore Student Tools', route: '/high-school', span: '' },
              { label: 'For Talent', rgb: '59,130,246', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />,
                headline: 'Get matched to roles across every STEM sector.',
                bullets: [`Search ${formatNumber(PLATFORM_STATS.totalJobs)}+ aggregated roles across all 50 states`, 'Filter by sector, clearance level, and specialization', 'Career tools built for STEM professionals — not generic job seekers'],
                cta: 'Create Your Profile', route: '/register?role=talent', span: '' },
              { label: 'For Industry', rgb: '139,92,246', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />,
                headline: 'Hire STEM talent your competitors can\'t find.',
                bullets: ['Post to a talent pool specializing in critical technology sectors', 'Source candidates with security clearances, lab experience, and niche skills', 'Workforce intelligence and pipeline analytics across 11 sectors'],
                cta: 'Start Hiring', route: '/register?role=partner', span: '' },
              { label: 'For Universities', rgb: '245,158,11', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />,
                headline: 'Connect graduates directly to the employers hiring them.',
                bullets: ['See which skills and programs are in demand by sector', 'Track graduate placement outcomes and employer connections', 'Align curricula with national workforce priorities in real time'],
                cta: 'Partner With Us', route: '/education-partners', span: '' },
              { label: 'For Federal Agencies', rgb: '16,185,129', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />,
                headline: 'Fill mission-critical STEM roles faster.',
                bullets: ['Source cleared candidates across all 50 states and 11 sectors', 'Build talent pipelines from university programs to agency roles', 'Workforce analytics aligned with federal STEM workforce priorities'],
                cta: 'Explore Federal Tools', route: '/partners/government', span: '' },
              { label: 'For State Workforce', rgb: '234,88,12', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />,
                headline: 'Turn your region into a STEM talent magnet.',
                bullets: ['See real-time workforce supply and demand by sector and region', 'Connect local training programs to employer hiring needs', 'Track economic development impact across STEM industries'],
                cta: 'Explore State Tools', route: '/partners/state-workforce', span: '' },
            ] as const).map((card, idx) => (
              <RevealSection key={card.label} delay={0.1 + idx * 0.08}><div className={`relative p-7 md:p-8 rounded-2xl border overflow-hidden group cursor-default transition-all duration-500 hover:-translate-y-1 h-full flex flex-col ${card.span}`} style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = `rgba(${card.rgb},0.3)`; el.style.boxShadow = `0 20px 50px -10px rgba(${card.rgb},0.08)`; }} onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.boxShadow = 'none'; }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(to bottom right, rgba(${card.rgb},0.04), transparent)` }} />
                <div className="relative flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `rgba(${card.rgb},0.1)` }}><svg className="w-5 h-5" style={{ color: `rgb(${card.rgb})` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{card.icon}</svg></div><span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: `rgb(${card.rgb})` }}>{card.label}</span></div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">{card.headline}</h3>
                  <ul className="space-y-3 mb-6 flex-1">{card.bullets.map((item, i) => (
                    <li key={i} className="flex items-start gap-3"><div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300" style={{ backgroundColor: `rgba(${card.rgb},0.1)`, transitionDelay: `${i * 0.05}s` }}><svg className="w-3 h-3" style={{ color: `rgb(${card.rgb})` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div><span className="text-sm text-gray-300 leading-relaxed">{item}</span></li>
                  ))}</ul>
                  <Button variant={idx === 0 ? 'primary' : 'outline'} size="md" className="w-full sm:w-auto text-sm px-6 group/btn mt-auto" onClick={() => navigate(card.route)}><span>{card.cta}</span><svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></Button>
                </div>
              </div></RevealSection>
            ))}</div>

        </div>
      </section>

      {/* START BUILDING CTA — full-width */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-white/[0.08] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.06] rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.06] rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Start building from here.</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">Whether you&#39;re hiring, job searching, placing graduates, or growing your practice — create your free account in under two minutes.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-10 py-4" onClick={() => navigate('/register')}>Create Free Account</Button>
              <Button variant="secondary" size="lg" className="text-base px-10 py-4" onClick={() => navigate('/register?role=partner')}>Become a Partner</Button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* LEGAL */}
      <section className="py-8 bg-[#0a0a0f] border-t border-white/[0.03]"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><p className="text-xs text-gray-500 text-center leading-relaxed">DISCLAIMER: STEMWorkforce.net is an early-stage platform in active development. Statistics, partner counts, and metrics displayed on this site represent forward-looking goals and design targets, not verified current data, unless explicitly stated otherwise. Sector categories shown represent target markets, not confirmed partnerships or endorsements. STEMWorkforce.net is not endorsed by or affiliated with any federal agency. Job listing counts reflect aggregated public data sources. We are committed to transparency and will update metrics as verified data becomes available.</p></div></section>
    </div>
  );
};

export default HomePage;
