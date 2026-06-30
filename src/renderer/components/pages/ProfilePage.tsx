import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [xpEvents, setXpEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ACTIVITY");

  useEffect(() => {
    window.gvmer?.getUser().then(setUser);
    window.gvmer?.getAchievements().then(setAchievements);
    window.gvmer?.getXpEvents().then(setXpEvents);
  }, []);

  const tabs = ["ACTIVITY", "ACHIEVEMENTS", "GAMES", "FRIENDS", "GALLERY", "BADGES"];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="w-5 h-5 rounded-full border border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const xpProgress = (user.xp % 1000) / 10;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (xpProgress / 100) * circumference;

  return (
    <div className="px-10 py-10 max-w-[1000px] min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-start gap-10"
      >
        <div className="w-28 h-28 rounded-full bg-border flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-medium text-secondary">
            {user.username?.[0]?.toUpperCase() || "G"}
          </span>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-medium text-foreground">{user.username}</h1>
          <p className="text-sm text-secondary mt-1">Level {user.level}</p>

          <div className="flex items-center gap-6 mt-4">
            <div className="relative w-[72px] h-[72px]">
              <svg width="72" height="72" viewBox="0 0 80 80" className="transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="#ECECEC" strokeWidth="3" fill="none" />
                <motion.circle
                  cx="40" cy="40" r="36"
                  stroke="#111"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-foreground">{xpProgress.toFixed(0)}%</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-medium text-foreground">{user.xp?.toLocaleString()}</span>
              <span className="text-xs text-secondary">Total XP</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex gap-8 mt-12 border-b border-border pb-0"
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
                layoutId="profileTabIndicator"
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
        {activeTab === "ACTIVITY" && (
          <div>
            <span className="text-xs font-medium text-foreground tracking-wider">Recent XP Gains</span>
            <div className="mt-4 space-y-3">
              {(xpEvents.length > 0 ? xpEvents : [
                { action: "Played Elden Ring", xp: 45, time: "2 hours ago" },
                { action: "Achievement: Elden Lord", xp: 250, time: "4 hours ago" },
                { action: "Played with friends", xp: 75, time: "5 hours ago" },
                { action: "Daily login bonus", xp: 50, time: "8 hours ago" },
              ]).map((event: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="flex items-center justify-between py-2.5 border-b border-border"
                >
                  <div>
                    <span className="text-sm text-foreground">{event.action}</span>
                    <span className="text-xs text-secondary ml-3">{event.time || "recent"}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">+{event.xp} XP</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ACHIEVEMENTS" && (
          <div className="grid grid-cols-2 gap-4">
            {(achievements.length > 0 ? achievements : []).map((a: any) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-5 rounded-xl border ${a.unlocked ? "border-border" : "border-border/50 opacity-50"}`}
              >
                <span className="text-lg">{a.icon || "🏆"}</span>
                <h3 className="text-sm font-medium text-foreground mt-2">{a.title}</h3>
                <p className="text-xs text-secondary mt-1">{a.description}</p>
                <span className="text-xs text-foreground mt-2 block">+{a.xp} XP</span>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "GAMES" && (
          <p className="text-sm text-secondary">Your game library appears here.</p>
        )}

        {activeTab === "FRIENDS" && (
          <p className="text-sm text-secondary">Friend list coming soon.</p>
        )}

        {activeTab === "GALLERY" && (
          <p className="text-sm text-secondary">Screenshots coming soon.</p>
        )}

        {activeTab === "BADGES" && (
          <p className="text-sm text-secondary">No badges earned yet.</p>
        )}
      </motion.div>
    </div>
  );
}
