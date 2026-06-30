import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Page } from "../../../shared/types";

interface GamePageProps {
  gameId: string;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  if (h < 1) return `${minutes}m`;
  return `${h}h ${minutes % 60}m`;
}

export function GamePage({ gameId, onBack, onNavigate }: GamePageProps) {
  const [game, setGame] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("SCREENSHOTS");

  useEffect(() => {
    window.gvmer?.getGame(gameId).then(setGame);
  }, [gameId]);

  const tabs = ["PLAY", "SCREENSHOTS", "COMMUNITY", "DISCUSSIONS", "NEWS"];

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="w-5 h-5 rounded-full border border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="relative w-full aspect-[21/9] bg-border overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 bg-foreground"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute bottom-0 left-0 right-0 px-10 pb-10">
          <motion.button
            onClick={onBack}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-secondary hover:text-foreground transition-colors duration-150 mb-4 block"
          >
            ← Back to Library
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl font-medium text-foreground"
          >
            {game.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base text-secondary mt-2"
          >
            {game.developer || "Unknown Developer"} · {game.platform}
          </motion.p>
        </div>
      </div>

      <div className="px-10 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex gap-8 mt-8"
        >
          <div className="flex flex-col">
            <span className="text-xs text-secondary">Hours Played</span>
            <span className="text-lg font-medium text-foreground mt-1">{formatHours(game.hoursPlayed)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-secondary">Achievements</span>
            <span className="text-lg font-medium text-foreground mt-1">{game.achievements}/{game.totalAchievements}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex gap-8 mt-10 border-b border-border pb-0"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-nav pb-3 transition-colors duration-150 relative ${
                activeTab === tab ? "text-foreground" : "text-secondary hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="gameTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8"
        >
          {activeTab === "PLAY" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                window.gvmer?.launchGame(game.installPath, game.launcherId);
              }}
              className="px-8 py-3 bg-foreground text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity duration-150"
            >
              Launch {game.title}
            </motion.button>
          )}

          {activeTab === "SCREENSHOTS" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-video bg-border rounded-xl overflow-hidden">
                  <motion.div
                    className="w-full h-full bg-foreground/5"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "COMMUNITY" && (
            <p className="text-sm text-secondary">
              Community features coming soon. Friends who own this game will appear here.
            </p>
          )}

          {activeTab === "DISCUSSIONS" && (
            <p className="text-sm text-secondary">No discussions yet.</p>
          )}

          {activeTab === "NEWS" && (
            <p className="text-sm text-secondary">No recent news.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
