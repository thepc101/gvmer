import { motion } from "framer-motion";

export function DiscoverPage() {
  return (
    <div className="px-10 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="text-nav text-secondary tracking-widest">Discover</span>
        <p className="text-sm text-secondary mt-6">Game discovery and recommendations coming soon.</p>
      </motion.div>
    </div>
  );
}
