import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import type { Page } from "../../../shared/types";

interface TitleBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSearchOpen?: () => void;
}

export function TitleBar({ currentPage, onNavigate, onSearchOpen }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.gvmer?.isMaximized().then(setIsMaximized);
    const unsub = window.gvmer?.onMaximizeChange((maximized) => {
      setIsMaximized(maximized);
    });
    return () => unsub?.();
  }, []);

  return (
    <div className="flex-shrink-0 h-10 bg-background flex items-center drag-region px-3 gap-2 border-b border-border">
      {/* App logo */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <Logo size={16} />
        <span className="text-sm font-medium text-foreground tracking-tight">gvmer</span>
      </div>

      {/* Spacer for dragging */}
      <div
        className="flex-1 h-full cursor-default"
        onDoubleClick={() => {
          window.gvmer?.maximize();
        }}
      />

      {/* Window controls */}
      <div className="flex items-center gap-1 no-drag">
        <button
          onClick={() => onSearchOpen?.()}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-foreground hover:bg-[rgba(0,0,0,.04)] rounded-lg transition-colors duration-150"
          title="Search (Ctrl+K)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9.5 9.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          onClick={() => onNavigate("profile")}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-foreground hover:bg-[rgba(0,0,0,.04)] rounded-lg transition-colors duration-150"
          title="Profile"
        >
          <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center">
            <span className="text-[8px] font-medium text-secondary">G</span>
          </div>
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={() => window.gvmer?.minimize()}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-foreground hover:bg-[rgba(0,0,0,.04)] rounded-lg transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          onClick={() => window.gvmer?.maximize()}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-foreground hover:bg-[rgba(0,0,0,.04)] rounded-lg transition-colors duration-150"
        >
          {isMaximized ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <path d="M3 5.5A2.5 2.5 0 015.5 3" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          )}
        </button>

        <button
          onClick={() => window.gvmer?.close()}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
