import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function AboutPage() {
  const [appInfo, setAppInfo] = useState<any>(null);

  useEffect(() => {
    window.gvmer?.getAppInfo().then(setAppInfo);
  }, []);

  const openLink = (url: string) => {
    window.gvmer?.openExternal(url);
  };

  return (
    <div className="px-10 py-10 max-w-[600px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="text-nav text-secondary tracking-widest">About</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-10 space-y-8"
      >
        {/* App identity */}
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-medium text-white">g</span>
          </div>
          <div>
            <h1 className="text-2xl font-medium text-foreground">gvmer</h1>
            <p className="text-sm text-secondary mt-1">
              Version {appInfo?.version || "1.0.0"}
            </p>
            <p className="text-xs text-secondary mt-0.5">
              gvmer Inc. — All rights reserved.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-border pt-6">
          <p className="text-sm text-foreground leading-relaxed">
            The gaming operating system. A premium desktop application that brings together your
            game library, friends, achievements, social feed, voice chat, and activity into one
            beautifully designed experience.
          </p>
        </div>

        {/* Links */}
        <div className="border-t border-border pt-6 space-y-3">
          <button
            onClick={() => openLink("https://gvmer.app/privacy")}
            className="block text-sm text-foreground hover:text-secondary transition-colors duration-150 underline underline-offset-2"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => openLink("https://gvmer.app/terms")}
            className="block text-sm text-foreground hover:text-secondary transition-colors duration-150 underline underline-offset-2"
          >
            Terms of Service
          </button>
          <button
            onClick={() => openLink("https://gvmer.app/support")}
            className="block text-sm text-foreground hover:text-secondary transition-colors duration-150 underline underline-offset-2"
          >
            Support Contact
          </button>
          <button
            onClick={() => openLink("https://github.com/thepc101/gvmer")}
            className="block text-sm text-foreground hover:text-secondary transition-colors duration-150 underline underline-offset-2"
          >
            GitHub Repository
          </button>
        </div>

        {/* Technical details */}
        {appInfo && (
          <div className="border-t border-border pt-6">
            <span className="text-xs font-medium text-foreground tracking-wider">Technical Details</span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Electron</span>
                <span className="text-foreground">{appInfo.electron}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Chrome</span>
                <span className="text-foreground">{appInfo.chrome}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Node.js</span>
                <span className="text-foreground">{appInfo.node}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Platform</span>
                <span className="text-foreground">{appInfo.platform} {appInfo.arch}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary">User Data</span>
                <span className="text-foreground truncate ml-4 max-w-[300px]" title={appInfo.userData}>
                  {appInfo.userData}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Credits */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-secondary">
            Built with Electron, React, TypeScript, TailwindCSS, and Framer Motion.
          </p>
          <p className="text-xs text-secondary mt-1">
            Inter font by Rasmus Andersson.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
