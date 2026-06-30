import { motion } from "framer-motion";

export function PartiesPage() {
  return (
    <div className="px-10 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="text-nav text-secondary tracking-widest">Parties</span>
        <p className="text-sm text-secondary mt-6">Voice chat parties will appear here.</p>
        <div className="mt-8 max-w-md">
          <div className="border border-border rounded-2xl p-8 text-center">
            <p className="text-sm text-secondary">No active parties</p>
            <p className="text-xs text-secondary mt-2">Start a party to voice chat with friends</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
