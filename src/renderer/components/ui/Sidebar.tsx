import { motion } from "framer-motion";
import { NAV_ITEMS } from "../../../shared/constants";
import type { Page } from "../../../shared/types";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const c = active ? "var(--foreground)" : "var(--secondary)";

  switch (icon) {
    case "home":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 8l7-6 7 6v7a1 1 0 01-1 1H3a1 1 0 01-1-1V8z" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <path d="M6 15V9h6v6" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "library":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="3" width="4" height="12" rx="1" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <rect x="7" y="1" width="4" height="14" rx="1" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <rect x="13" y="5" width="4" height="10" rx="1" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
        </svg>
      );
    case "social":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="6" cy="6" r="3" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <circle cx="13" cy="5" r="2.5" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <path d="M2 16c0-3 1.8-5 4-5s4 2 4 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M10 15c0-2.2 1.3-4 3-4s3 1.8 3 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "messages":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1 3a1 1 0 011-1h14a1 1 0 011 1v9a1 1 0 01-1 1H6l-3 3v-3H2a1 1 0 01-1-1V3z" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <path d="M5 6h8M5 9h5" stroke={c} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "parties":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3a3 3 0 100 6 3 3 0 000-6z" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <path d="M3 15c0-3 2.7-5 6-5s6 2 6 5" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M15 5v4M13 7h4" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill={active ? c : "none"} />
        </svg>
      );
    case "profile":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="7" r="4" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <path d="M2 17c0-4 3.1-6 7-6s7 2 7 6" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "discover":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke={c} strokeWidth="1.5" fill="none" />
          <path d="M9 5v.01M9 12.99V13" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M5 9h.01M12.99 9H13" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M6.5 6.5l5 5" stroke={c} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "settings":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="2.5" stroke={c} strokeWidth="1.5" fill={active ? c : "none"} />
          <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.5 3.5l1.5 1.5M13 13l1.5 1.5M3.5 14.5L5 13M13 5l1.5-1.5" stroke={c} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </svg>
      );
    default:
      return <div className="w-[18px] h-[18px]" />;
  }
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const user = { username: "gvmer", level: 24, initials: "G", xp: 28450, nextLevelXp: 30000 };

  const progress = user.xp / user.nextLevelXp;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-shrink-0 w-[220px] flex flex-col py-6 px-4 bg-background border-r border-border select-none"
    >
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((item, i) => {
          const isActive = currentPage === item.page;
          return (
            <motion.button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className={`relative group flex items-center gap-3 h-11 px-3 rounded-xl text-sm transition-all duration-150 text-left ${
                isActive
                  ? "text-foreground bg-[rgba(0,0,0,.04)] font-medium"
                  : "text-secondary hover:text-foreground hover:bg-[rgba(0,0,0,.02)]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute left-0 w-[3px] h-5 bg-foreground rounded-r-full"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
              <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                <NavIcon icon={item.icon} active={isActive} />
              </span>
              <span className="ml-0.5">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 ring-2 ring-foreground/5">
              <span className="text-xs font-semibold text-foreground">{user.initials}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-foreground truncate leading-tight">{user.username}</span>
              <span className="text-[10px] text-secondary">Level {user.level}</span>
            </div>
          </div>
          <div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full bg-foreground rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
