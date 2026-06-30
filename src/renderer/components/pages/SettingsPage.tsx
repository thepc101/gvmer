import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AboutPage } from "./AboutPage";

const platforms = ["Steam", "Xbox", "Epic Games", "Discord", "Battle.net", "Minecraft", "EA", "Ubisoft"];

export function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [connected, setConnected] = useState<Set<string>>(new Set(["Steam", "Discord"]));
  const [activeSection, setActiveSection] = useState("accounts");
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  useEffect(() => {
    window.gvmer?.getSettings().then((s) => {
      setSettings(s);
      if (s.connectedAccounts) setConnected(new Set(s.connectedAccounts));
    });

    // Update listeners
    const unsubChecking = window.gvmer?.onUpdateChecking(() => setUpdateStatus("Checking for updates..."));
    const unsubAvailable = window.gvmer?.onUpdateAvailable((info) =>
      setUpdateStatus(`Update ${info.version} available — downloading...`)
    );
    const unsubDownloaded = window.gvmer?.onUpdateDownloaded((info) =>
      setUpdateStatus(`Update ${info.version} downloaded. Click to install.`)
    );
    const unsubNotAvailable = window.gvmer?.onUpdateNotAvailable(() =>
      setUpdateStatus("You're up to date.")
    );
    const unsubError = window.gvmer?.onUpdateError((err) =>
      setUpdateStatus(`Update failed: ${err}`)
    );

    return () => {
      unsubChecking?.();
      unsubAvailable?.();
      unsubDownloaded?.();
      unsubNotAvailable?.();
      unsubError?.();
    };
  }, []);

  const togglePlatform = async (p: string) => {
    const next = new Set(connected);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setConnected(next);
    await window.gvmer?.updateSettings("connectedAccounts", Array.from(next));
  };

  const sections = [
    { id: "accounts", label: "Connected Accounts" },
    { id: "appearance", label: "Appearance" },
    { id: "privacy", label: "Privacy" },
    { id: "updates", label: "Updates" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="flex h-full">
      {/* Section sidebar */}
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

      {/* Content */}
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

              {activeSection === "privacy" && (
                <>
                  <span className="text-xs font-medium text-foreground tracking-wider">Privacy</span>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Online Status</span>
                      <div className="w-9 h-5 rounded-full bg-foreground relative">
                        <motion.div
                          animate={{ x: 18 }}
                          className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Activity Visibility</span>
                      <div className="w-9 h-5 rounded-full bg-foreground relative">
                        <motion.div
                          animate={{ x: 18 }}
                          className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3.5 border-b border-border">
                      <span className="text-sm text-foreground">Notifications</span>
                      <div className="w-9 h-5 rounded-full bg-foreground relative">
                        <motion.div
                          animate={{ x: 18 }}
                          className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5"
                        />
                      </div>
                    </div>
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
                        <motion.div
                          animate={{ x: 18 }}
                          className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 left-0.5"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setUpdateStatus("Checking...");
                          window.gvmer?.checkForUpdates();
                        }}
                        className="px-5 py-2.5 bg-foreground text-white text-sm rounded-full hover:opacity-90 transition-opacity duration-150"
                      >
                        Check for Updates
                      </button>
                      {updateStatus && (
                        <p className="text-xs text-secondary mt-3">{updateStatus}</p>
                      )}
                    </div>
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
