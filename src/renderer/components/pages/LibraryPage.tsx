import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { GameCard } from "../ui/GameCard";

interface LibraryPageProps {
  onSelectGame: (id: string) => void;
}

const platforms = ["All", "Steam", "Epic", "Xbox", "Battle.net", "Minecraft", "EA", "Ubisoxt"];

export function LibraryPage({ onSelectGame }: LibraryPageProps) {
  const [games, setGames] = useState<any[]>([]);
  const [activePlatform, setActivePlatform] = useState("All");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    window.gvmer?.getGames().then(setGames);
  }, []);

  const filteredGames = useMemo(
    () =>
      activePlatform === "All"
        ? games
        : games.filter((g) => g.platform === activePlatform),
    [games, activePlatform]
  );

  const handleScan = async () => {
    setScanning(true);
    try {
      await window.gvmer?.scanGames();
      const updated = await window.gvmer?.getGames();
      setGames(updated);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="px-10 py-10 max-w-[1400px] min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-nav text-secondary tracking-widest">Library</span>
          <p className="text-xs text-secondary mt-1">{games.length} games detected</p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="text-xs text-foreground border border-border px-4 py-2 rounded-full hover:bg-[rgba(0,0,0,.04)] transition-colors duration-150 disabled:opacity-50"
        >
          {scanning ? "Scanning..." : "Scan for games"}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex gap-6 mt-8 border-b border-border pb-0"
      >
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`text-nav pb-3 transition-colors duration-150 relative ${
              activePlatform === p
                ? "text-foreground"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {p}
            {activePlatform === p && (
              <motion.div
                layoutId="platformIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )}
          </button>
        ))}
      </motion.div>

      <motion.div
        key={activePlatform}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-10"
      >
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} onSelect={onSelectGame} />
        ))}
      </motion.div>
    </div>
  );
}
