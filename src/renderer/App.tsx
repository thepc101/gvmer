import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TitleBar } from "./components/ui/TitleBar";
import { Sidebar } from "./components/ui/Sidebar";
import type { Page } from "../shared/types";

const HomePage = lazy(() => import("./components/pages/HomePage").then((m) => ({ default: m.HomePage })));
const LibraryPage = lazy(() => import("./components/pages/LibraryPage").then((m) => ({ default: m.LibraryPage })));
const GamePage = lazy(() => import("./components/pages/GamePage").then((m) => ({ default: m.GamePage })));
const SocialPage = lazy(() => import("./components/pages/SocialPage").then((m) => ({ default: m.SocialPage })));
const MessagesPage = lazy(() => import("./components/pages/MessagesPage").then((m) => ({ default: m.MessagesPage })));
const ProfilePage = lazy(() => import("./components/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("./components/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const PartiesPage = lazy(() => import("./components/pages/PartiesPage").then((m) => ({ default: m.PartiesPage })));
const DiscoverPage = lazy(() => import("./components/pages/DiscoverPage").then((m) => ({ default: m.DiscoverPage })));

const PAGE_LOADER = (
  <div className="flex-1 flex items-center justify-center min-h-full">
    <div className="w-5 h-5 rounded-full border border-foreground/20 border-t-foreground animate-spin" />
  </div>
);

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
};

export function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [updateBanner, setUpdateBanner] = useState<string | null>(null);

  useEffect(() => {
    const unsubSearch = window.gvmer?.onSearchShortcut?.(() => setSearchOpen(true));
    const unsubSettings = window.gvmer?.onSettingsShortcut?.(() => setPage("settings"));
    const unsubUpdateAvail = window.gvmer?.onUpdateAvailable?.((info) => {
      window.gvmer?.downloadUpdate();
    });
    const unsubUpdateDone = window.gvmer?.onUpdateDownloaded?.((info) => {
      setUpdateBanner(`Update ${info.version} ready. Click to restart.`);
    });
    const unsubGamesScanned = window.gvmer?.onGamesScanned?.((count) => {
      window.gvmer?.log("info", `Background scan found ${count} games`);
    });

    return () => {
      unsubSearch?.();
      unsubSettings?.();
      unsubUpdateAvail?.();
      unsubUpdateDone?.();
      unsubGamesScanned?.();
    };
  }, []);

  const handleSelectGame = useCallback((id: string) => {
    setSelectedGameId(id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedGameId(null);
  }, []);

  // Game detail view
  if (selectedGameId) {
    return (
      <div className="h-screen w-screen flex flex-col bg-background">
        <TitleBar onNavigate={(p) => { setPage(p); setSelectedGameId(null); }} currentPage="library" />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar currentPage="library" onNavigate={(p) => { setPage(p); setSelectedGameId(null); }} />
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={PAGE_LOADER}>
              <GamePage gameId={selectedGameId} onBack={handleBack} onNavigate={(p) => { setPage(p); setSelectedGameId(null); }} />
            </Suspense>
          </main>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage onSelectGame={handleSelectGame} />;
      case "library": return <LibraryPage onSelectGame={handleSelectGame} />;
      case "social": return <SocialPage />;
      case "messages": return <MessagesPage />;
      case "parties": return <PartiesPage />;
      case "profile": return <ProfilePage />;
      case "discover": return <DiscoverPage />;
      case "settings": return <SettingsPage />;
      default: return <HomePage onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <TitleBar onNavigate={setPage} currentPage={page} onSearchOpen={() => setSearchOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={page} onNavigate={setPage} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
              transition={pageTransition.transition}
              className="h-full"
            >
              <Suspense fallback={PAGE_LOADER}>
                {renderPage()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Update banner */}
      {updateBanner && (
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-foreground text-white px-6 py-3 flex items-center justify-between"
        >
          <span className="text-sm">{updateBanner}</span>
          <div className="flex gap-3">
            <button
              onClick={() => {
                window.gvmer?.installUpdate();
              }}
              className="text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Restart & Install
            </button>
            <button
              onClick={() => setUpdateBanner(null)}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} onSelectGame={handleSelectGame} />
      )}
    </div>
  );
}

function SearchOverlay({ onClose, onSelectGame }: { onClose: () => void; onSelectGame: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ games: any[] }>({ games: [] });

  useEffect(() => {
    if (query.length < 1) { setResults({ games: [] }); return; }
    const timer = setTimeout(async () => {
      try { const res = await window.gvmer.search(query); setResults(res); } catch {}
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-start justify-center pt-[120px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-[560px] bg-white rounded-2xl shadow-dropdown border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border">
          <input
            autoFocus
            type="text"
            placeholder="Search games, friends, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-secondary outline-none"
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto py-2">
          {results.games.length > 0 ? (
            results.games.map((game: any) => (
              <button
                key={game.id}
                onClick={() => { onSelectGame(game.id); onClose(); }}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-[rgba(0,0,0,.04)] transition-colors duration-150 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-border flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-foreground">{game.title}</span>
                  <span className="text-xs text-secondary block">{game.platform}</span>
                </div>
              </button>
            ))
          ) : query.length > 0 ? (
            <p className="text-sm text-secondary px-5 py-4">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            <p className="text-sm text-secondary px-5 py-4">Type to search...</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
