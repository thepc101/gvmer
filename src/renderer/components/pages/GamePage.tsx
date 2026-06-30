import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "../../lib/GameContext";
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

export function GamePage({ gameId, onBack }: GamePageProps) {
  const { getGame, deleteGame, uploadGameImage } = useGame();
  const [game, setGame] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("PLAY");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const loadGame = async () => {
    const g = await getGame(gameId);
    if (g) setGame(g);
  };

  useEffect(() => { loadGame(); }, [gameId, getGame]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "cover_image" | "hero_image") => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadGameImage(gameId, file, type);
      await loadGame();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove this game from your library?")) return;
    await deleteGame(gameId);
    onBack();
  };

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
      <div className={`relative w-full ${game.hero_image ? "aspect-[21/9]" : "h-56"} bg-border overflow-hidden`}>
        {game.hero_image ? (
          <img src={game.hero_image} alt="" className="w-full h-full object-cover" />
        ) : (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 bg-foreground"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <input
          ref={heroInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageSelect(e, "hero_image")}
        />
        <button
          onClick={() => heroInputRef.current?.click()}
          className="absolute top-4 right-4 text-[10px] text-secondary border border-border px-3 py-1.5 rounded-full hover:bg-[rgba(0,0,0,.04)] transition-colors z-10"
        >
          {game.hero_image ? "Change Hero" : "Add Hero Image"}
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-10 pb-10 flex items-end gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-28 aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-lg border border-border">
              {game.cover_image ? (
                <img src={game.cover_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary/30">{game.title?.[0]}</span>
                </div>
              )}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e, "cover_image")}
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 text-[9px] bg-foreground text-white px-2.5 py-1 rounded-full hover:opacity-90 transition-opacity shadow-sm"
            >
              Set Cover
            </button>
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-secondary hover:text-foreground transition-colors duration-150 mb-2 block"
            >
              ← Back to Library
            </motion.button>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl font-medium text-foreground truncate"
            >
              {game.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-sm text-secondary mt-1"
            >
              {game.developer || "Unknown"} · {game.platform}
            </motion.p>
          </div>

          <button
            onClick={handleDelete}
            className="text-[10px] text-red-500/60 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="px-10 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex gap-8 mt-6"
        >
          <div className="flex flex-col">
            <span className="text-xs text-secondary">Hours Played</span>
            <span className="text-lg font-medium text-foreground mt-1">{formatHours(game.hours_played)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-secondary">Achievements</span>
            <span className="text-lg font-medium text-foreground mt-1">{game.achievements}/{game.total_achievements}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex gap-8 mt-8 border-b border-border pb-0 overflow-x-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-nav pb-3 whitespace-nowrap transition-colors duration-150 relative ${
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
              onClick={() => window.gvmer?.launchGame(game.install_path, game.launcher_id)}
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
              Community features coming soon.
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
