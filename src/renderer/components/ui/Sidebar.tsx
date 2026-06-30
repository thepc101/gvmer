import { motion } from "framer-motion";
import { NAV_ITEMS } from "../../../shared/constants";
import type { Page } from "../../../shared/types";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const user = { username: "gvmer", level: 24, initials: "G" };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-shrink-0 w-[200px] flex flex-col py-5 px-5 bg-background border-r border-border select-none"
    >
      <div className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`relative group flex items-center h-9 text-nav transition-colors duration-150 text-left ${
                isActive ? "text-foreground" : "text-secondary hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute left-0 w-[2px] h-4 bg-foreground"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
              <span className="ml-3">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-3 py-3 border-t border-border">
          <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-medium text-secondary">{user.initials}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-foreground truncate">{user.username}</span>
            <span className="text-[10px] text-secondary">Level {user.level}</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
