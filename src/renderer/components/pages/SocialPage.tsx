import { motion } from "framer-motion";

const posts = [
  {
    id: "p1",
    username: "luna",
    initials: "L",
    timestamp: "30m ago",
    caption: "just finished the Elden Ring DLC. what a journey.",
    likes: 142,
    comments: 23,
    liked: true,
  },
  {
    id: "p2",
    username: "nexus",
    initials: "N",
    timestamp: "2h ago",
    caption: "what's everyone playing this weekend?",
    likes: 89,
    comments: 56,
    liked: false,
    poll: {
      question: "what's everyone playing this weekend?",
      options: [
        { text: "Elden Ring", votes: 45 },
        { text: "Balatro", votes: 32 },
        { text: "Hades II", votes: 28 },
        { text: "Something else", votes: 15 },
      ],
    },
  },
  {
    id: "p3",
    username: "cipher",
    initials: "C",
    timestamp: "5h ago",
    caption: "new personal best in Balatro. 12 million points.",
    likes: 67,
    comments: 12,
    liked: true,
  },
];

export function SocialPage() {
  return (
    <div className="flex justify-center px-10 py-10">
      <div className="w-full max-w-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-nav text-secondary tracking-widest">Social Feed</span>
        </motion.div>

        <div className="mt-8 space-y-12">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="border-b border-border pb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center">
                  <span className="text-xs font-medium text-secondary">{post.initials}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{post.username}</span>
                  <span className="text-xs text-secondary ml-2">{post.timestamp}</span>
                </div>
              </div>

              {post.poll && (
                <div className="mb-4">
                  <p className="text-sm text-foreground mb-3">{post.poll.question}</p>
                  <div className="space-y-2">
                    {post.poll.options.map((opt, idx) => {
                      const total = post.poll!.options.reduce((s, o) => s + o.votes, 0);
                      const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                      return (
                        <button
                          key={idx}
                          className="relative w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-[rgba(0,0,0,.04)] transition-colors duration-150 overflow-hidden"
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                            className="absolute inset-y-0 left-0 bg-black/5"
                          />
                          <div className="relative flex justify-between items-center">
                            <span className="text-sm text-foreground">{opt.text}</span>
                            <span className="text-xs text-secondary">{pct}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-sm text-foreground leading-relaxed mb-4">{post.caption}</p>

              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1.5 text-xs text-foreground transition-colors duration-150">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3.5C6.5 1 3 1.5 3 5c0 3 5 7 5 7s5-4 5-7c0-3.5-3.5-4-5-1.5z" stroke="#111" fill="#111" strokeWidth="1.2" />
                  </svg>
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-secondary hover:text-foreground transition-colors duration-150">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8c0-3.5 3.5-6 7-6s7 2.5 7 6-3.5 6-7 6c-1 0-2-.2-3-.5L2 14l1-2.5C1.5 10.5 1 9.3 1 8z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  </svg>
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-secondary hover:text-foreground transition-colors duration-150">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 3l4 4-4 4M14 7H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
