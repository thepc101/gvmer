import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "../../lib/GameContext";

export function ProfilePage() {
  const { getProfile, getAchievements, getXpEvents } = useGame();
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [xpEvents, setXpEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ACTIVITY");

  useEffect(() => {
    getProfile().then(setUser);
    getAchievements().then(setAchievements);
    getXpEvents().then(setXpEvents);
  }, [getProfile, getAchievements, getXpEvents]);

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

  const unlockedAch = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="px-10 py-10 max-w-[1400px] min-h-full">
      <div className="flex gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-shrink-0 w-64"
        >
          <div className="relative w-40 h-40 mx-auto">
            <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
              <circle cx="80" cy="80" r="36" fill="none" stroke="#ECECEC" strokeWidth="4" />
              <motion.circle
                cx="80" cy="80" r="36" fill="none" stroke="#111" strokeWidth="4"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-medium text-foreground">{user.level}</span>
              <span className="text-[10px] text-secondary">Level</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <h2 className="text-xl font-medium text-foreground">{user.username}</h2>
            <p className="text-xs text-secondary mt-1">
              {user.xp.toLocaleString()} XP · {unlockedAch} achievements
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 min-w-0"
        >
          <div className="flex gap-8 border-b border-border pb-0">
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
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6"
          >
            {activeTab === "ACTIVITY" && (
              <div className="space-y-3">
                {xpEvents.length === 0 && <p className="text-sm text-secondary">No activity yet.</p>}
                {xpEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{event.action}</span>
                    <span className="text-xs text-secondary">+{event.xp} XP</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "ACHIEVEMENTS" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-xl ${ach.unlocked ? "border-border" : "border-border/50 opacity-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{ach.icon || "🏆"}</span>
                      <div>
                        <span className="text-sm font-medium text-foreground block">{ach.title}</span>
                        <span className="text-xs text-secondary">{ach.description}</span>
                      </div>
                    </div>
                    {ach.unlocked ? (
                      <span className="text-[10px] text-secondary mt-2 block">+{ach.xp} XP</span>
                    ) : (
                      <span className="text-[10px] text-secondary mt-2 block">Locked</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "GAMES" && (
              <p className="text-sm text-secondary">Your game collection appears here.</p>
            )}

            {activeTab === "FRIENDS" && (
              <p className="text-sm text-secondary">Friends list coming soon.</p>
            )}

            {activeTab === "GALLERY" && (
              <p className="text-sm text-secondary">Screenshot gallery coming soon.</p>
            )}

            {activeTab === "BADGES" && (
              <p className="text-sm text-secondary">Badges coming soon.</p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
