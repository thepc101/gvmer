import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AboutPage } from "./AboutPage";
import { useGame } from "../../lib/GameContext";

const platforms = ["Steam", "Xbox", "Epic Games", "Discord", "Battle.net", "Minecraft", "EA", "Ubisoft"];

export function SettingsPage() {
  const { getSettings, updateSetting, getProfile, updateProfile, deleteAccount, signOut } = useGame();
  const [connected, setConnected] = useState<Set<string>>(new Set(["Steam", "Discord"]));
  const [activeSection, setActiveSection] = useState("accounts");
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("online");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      if (s.connectedAccounts) setConnected(new Set(s.connectedAccounts));
    });
    getProfile().then((p) => {
      if (p) { setUsername(p.username); setStatus(p.status); }
    });

    const unsubChecking = window.gvmer?.onUpdateChecking(() => setUpdateStatus("Checking for updates..."));
    const unsubAvailable = window.gvmer?.onUpdateAvailable((info) =>
      setUpdateStatus(`Update ${info.version} available`)
    );
    const unsubDownloaded = window.gvmer?.onUpdateDownloaded((info) =>
      setUpdateStatus(`Update ${info.version} downloaded.`)
    );
    const unsubNotAvailable = window.gvmer?.onUpdateNotAvailable(() =>
      setUpdateStatus("You're up to date.")
    );
    const unsubError = window.gvmer?.onUpdateError((err) =>
      setUpdateStatus(`Update failed: ${err}`)
    );

    return () => {
      unsubChecking?.(); unsubAvailable?.(); unsubDownloaded?.();
      unsubNotAvailable?.(); unsubError?.();
    };
  }, [getSettings, getProfile]);

  const togglePlatform = async (p: string) => {
    const next = new Set(connected);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setConnected(next);
    await updateSetting("connectedAccounts", Array.from(next));
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Delete all data? This cannot be undone.")) return;
    if (!confirm("Really? All games, progress, and settings will be removed.")) return;
    setDeleting(true);
    try {
      await deleteAccount();
      await signOut();
    } finally {
      setDeleting(false);
    }
  };

  const sections = [
    { id: "accounts", label: "Connected Accounts" },
    { id: "appearance", label: "Appearance" },
    { id: "profile", label: "Profile" },
    { id: "privacy", label: "Privacy" },
    { id: "updates", label: "Updates" },
    { id: "account", label: "Account" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="flex h-full">
      <div className="w-48 border-r border-border flex-shrink-0 px-6 py-10">
        <span className="text-nav text-secondary tracking-widest block mb-6">Settings</span>
        <div className="flex flex-col gap-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`text-left text-sm py-2 transition-colors duration-150 ${
                activeSection === s.id ? "text-foreground font-medium" : "text-secondary hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeSection === "about" ? (
          <AboutPage />
        ) : (
          <div className="px-10 py-10 max-w-[700px]">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {activeSection === "accounts" && (
                <>
                  <span className="text-xs font-medium text-foreground tracking-wider">Connected Accounts</span>
                  <div className="mt-4 space-y-1">
                    {platforms.map((p, i) => (
                      <motion.div
                        key={p}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02, duration: 0.2 }}
                        className="flex items-center justify-between py-3.5 border-b border-border"
                      >
                        <span className="text-sm text-foreground">{p}</span>
                        <button
                          onClick={() => togglePlatform(p)}
                          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                            connected.has(p) ? "bg-foreground" : "bg-border"
                          }`}
                        >
                          <motion.div
                            animate={{ x: connected.has(p) ? 18 : 2 }}
                            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                            className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5"
                          />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "appearance" && (
                <>
                  <span className="text-xs font-medium text-foreground tracking-wider">Appearance</span>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Theme</span>
                      <span className="text-sm text-secondary">Light</span>
                    </div>
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Language</span>
                      <span className="text-sm text-secondary">English</span>
                    </div>
                  </div>
                </>
              )}

              {activeSection === "profile" && (
                <>
                  <span className="text-xs font-medium text-foreground tracking-wider">Profile</span>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Username</span>
                      <input
                        type="text"
                        value={username}
                        onChange={async (e) => {
                          setUsername(e.target.value);
                          await updateProfile({ username: e.target.value });
                        }}
                        className="text-sm text-secondary bg-transparent border border-border rounded-lg px-3 py-1.5 text-right focus:outline-none focus:border-foreground transition-colors w-40"
                      />
                    </div>
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Status</span>
                      <select
                        value={status}
                        onChange={async (e) => {
                          setStatus(e.target.value);
                          await updateProfile({ status: e.target.value });
                        }}
                        className="text-sm text-secondary bg-transparent border border-border rounded-lg px-3 py-1.5 text-right focus:outline-none focus:border-foreground transition-colors"
                      >
                        <option value="online">Online</option>
                        <option value="idle">Idle</option>
                        <option value="dnd">Do Not Disturb</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeSection === "privacy" && (
                <>
                  <span className="text-xs font-medium text-foreground tracking-wider">Privacy</span>
                  <div className="mt-4 space-y-1">
                    {["Online Status", "Activity Visibility", "Notifications"].map((label) => (
                      <div key={label} className="flex items-center justify-between py-3.5 border-b border-border">
                        <span className="text-sm text-foreground">{label}</span>
                        <div className="w-9 h-5 rounded-full bg-foreground relative">
                          <motion.div
                            animate={{ x: 18 }}
                            className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "updates" && (
                <>
                  <span className="text-xs font-medium text-foreground tracking-wider">Updates</span>
                  <div className="mt-4">
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Automatic Updates</span>
                      <div className="w-9 h-5 rounded-full bg-foreground relative">
                        <motion.div animate={{ x: 18 }} className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5" />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => { setUpdateStatus("Checking..."); window.gvmer?.checkForUpdates(); }}
                        className="px-5 py-2.5 bg-foreground text-white text-sm rounded-full hover:opacity-90 transition-opacity duration-150"
                      >
                        Check for Updates
                      </button>
                      {updateStatus && <p className="text-xs text-secondary mt-3">{updateStatus}</p>}
                    </div>
                  </div>
                </>
              )}

              {activeSection === "account" && (
                <>
                  <span className="text-xs font-medium text-foreground tracking-wider">Account</span>
                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-secondary leading-relaxed">
                      Permanently delete all data: games, achievements, XP, settings, and profile.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="px-5 py-2.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors duration-150 disabled:opacity-50"
                    >
                      {deleting ? "Resetting..." : "Delete All Data"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
