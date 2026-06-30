import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameCard } from "../ui/GameCard";
import { useGame } from "../../lib/GameContext";

interface HomePageProps {
  onSelectGame: (id: string) => void;
}

export function HomePage({ onSelectGame }: HomePageProps) {
  const { getGames } = useGame();
  const [games, setGames] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGames().then((allGames) => {
      setGames(allGames);
      setLoaded(true);
    });
  }, [getGames]);

  const continueGame = games.length > 0 ? games[0] : null;
  const recentlyPlayed = games.slice(0, 6);

  return (
    <div className="px-10 py-10 max-w-[1400px] min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="text-nav text-secondary tracking-widest">Continue Playing</span>
        <div className="mt-4 max-w-3xl">
          {continueGame ? (
            <GameCard game={continueGame} onSelect={onSelectGame} variant="landscape" />
          ) : (
            <div className="w-full aspect-[16/9] bg-border rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-secondary">No games yet</p>
                <button
                  onClick={async () => {
                    await window.gvmer?.scanGames();
                    const g = await getGames();
                    setGames(g);
                  }}
                  className="mt-3 text-xs text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Scan for games
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {games.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16"
        >
          <span className="text-nav text-secondary tracking-widest">Recently Played</span>
          <div className="mt-4 flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {recentlyPlayed.map((game) => (
              <GameCard key={game.id} game={game} onSelect={onSelectGame} variant="horizontal" />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-16"
      >
        <span className="text-nav text-secondary tracking-widest">Library Overview</span>
        <p className="text-xs text-secondary mt-2">
          {games.length > 0
            ? `${games.length} games`
            : loaded ? "No games found. Add games in Library." : "Loading..."}
        </p>
      </motion.div>
    </div>
  );
}
