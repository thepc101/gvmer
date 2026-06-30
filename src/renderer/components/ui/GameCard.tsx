import { useState } from "react";
import { motion } from "framer-motion";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    cover: string | null;
    cover_image: string | null;
    developer: string;
    platform: string;
    hours_played: number;
    achievements: number;
    total_achievements: number;
  };
  onSelect: (id: string) => void;
  variant?: "default" | "landscape" | "horizontal";
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  if (h < 1) return `${minutes}m`;
  return `${h}h ${minutes % 60}m`;
}

function GameImage({ game, className }: { game: any; className: string }) {
  const imgSrc = game.cover_image ? "file://" + game.cover_image : game.cover;
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt=""
        className={className + " object-cover"}
        onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
      />
    );
  }
  return null;
}

export function GameCard({ game, onSelect, variant = "default" }: GameCardProps) {
  const [hovered, setHovered] = useState(false);

  if (variant === "landscape") {
    return (
      <motion.button
        onClick={() => onSelect(game.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full aspect-[16/9] bg-border rounded-2xl overflow-hidden group text-left"
      >
        <GameImage game={game} className="absolute inset-0 w-full h-full" />
        <motion.div
          className="absolute inset-0 bg-foreground/5"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-medium text-white mb-1">{game.title}</h2>
          <p className="text-sm text-white/70">{game.developer}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-white/50">{formatHours(game.hours_played)} played</span>
            <span className="text-xs text-white/50">{game.achievements} achievements</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.9 }}
          transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#111">
            <path d="M5 3v14l12-7z" />
          </svg>
        </motion.div>
      </motion.button>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.button
        onClick={() => onSelect(game.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-shrink-0 w-[180px] text-left group"
      >
        <div className="relative aspect-[3/4] bg-border rounded-xl overflow-hidden mb-3">
          <GameImage game={game} className="absolute inset-0 w-full h-full" />
          <motion.div
            className="absolute inset-0 bg-foreground/5"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
        <h3 className="text-sm font-medium text-foreground truncate">{game.title}</h3>
        <p className="text-xs text-secondary mt-0.5">{formatHours(game.hours_played)} played</p>
        <p className="text-xs text-secondary">{game.achievements} achievements</p>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={() => onSelect(game.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full text-left group"
    >
      <div className="relative aspect-[3/4] bg-border rounded-xl overflow-hidden mb-4 shadow-card transition-shadow duration-200 group-hover:shadow-card-hover">
        <GameImage game={game} className="absolute inset-0 w-full h-full" />
        <motion.div
          className="absolute inset-0 bg-foreground/5"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] uppercase tracking-wider text-white bg-black/40 px-2 py-1 rounded-full">
            {game.platform}
          </span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-foreground truncate">{game.title}</h3>
      <p className="text-xs text-secondary mt-0.5 truncate">{game.developer}</p>
      <div className="flex items-center gap-3 mt-1.5">
        <span className="text-xs text-secondary">{formatHours(game.hours_played)}</span>
        <span className="text-xs text-secondary">{game.achievements}/{game.total_achievements} ach.</span>
      </div>
    </motion.button>
  );
}
