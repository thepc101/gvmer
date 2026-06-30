import { useState } from "react";
import { motion } from "framer-motion";

const conversations = [
  {
    id: "c1",
    username: "luna",
    initials: "L",
    online: true,
    typing: false,
    messages: [
      { id: "m1", fromMe: false, text: "hey, you online?", time: "1h ago", read: true },
      { id: "m2", fromMe: true, text: "yeah, just finished work. hopping on?", time: "55m ago", read: true },
      { id: "m3", fromMe: false, text: "give me 10 mins, loading up elden ring", time: "50m ago", read: true },
      { id: "m4", fromMe: true, text: "bet, I'll be at the Church of Elleh", time: "45m ago", read: false },
    ],
  },
  {
    id: "c2",
    username: "nexus",
    initials: "N",
    online: true,
    typing: true,
    messages: [
      { id: "m5", fromMe: false, text: "did you see the new update?", time: "3h ago", read: true },
      { id: "m6", fromMe: true, text: "not yet, what changed?", time: "2h ago", read: true },
    ],
  },
  {
    id: "c3",
    username: "cipher",
    initials: "C",
    online: false,
    typing: false,
    messages: [
      { id: "m7", fromMe: false, text: "ggs last night", time: "10h ago", read: true },
      { id: "m8", fromMe: true, text: "ggs! that last round was insane", time: "9h ago", read: true },
    ],
  },
];

export function MessagesPage() {
  const [activeConv, setActiveConv] = useState(conversations[0].id);
  const [input, setInput] = useState("");

  const conversation = conversations.find((c) => c.id === activeConv);

  return (
    <div className="flex h-full">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-72 border-r border-border flex flex-col flex-shrink-0"
      >
        <div className="px-6 py-5">
          <span className="text-nav text-secondary tracking-widest">Messages</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-colors duration-150 text-left ${
                activeConv === conv.id ? "bg-[rgba(0,0,0,.04)]" : "hover:bg-[rgba(0,0,0,.02)]"
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center">
                  <span className="text-xs font-medium text-secondary">{conv.initials}</span>
                </div>
                {conv.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-foreground rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{conv.username}</span>
                  <span className="text-[10px] text-secondary">{conv.messages[conv.messages.length - 1].time}</span>
                </div>
                <p className="text-xs text-secondary truncate mt-0.5">
                  {conv.messages[conv.messages.length - 1].text}
                </p>
                {conv.typing && <p className="text-xs text-foreground mt-0.5">typing...</p>}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        key={activeConv}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 flex flex-col"
      >
        {conversation && (
          <>
            <div className="flex items-center gap-3 px-8 py-4 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center">
                <span className="text-xs font-medium text-secondary">{conversation.initials}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">{conversation.username}</span>
                <span className="text-xs text-secondary ml-2">{conversation.online ? "Online" : "Offline"}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
              {conversation.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                      msg.fromMe ? "bg-foreground text-white" : "bg-[rgba(0,0,0,.04)] text-foreground"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[10px] mt-1 block ${msg.fromMe ? "text-white/60" : "text-secondary"}`}>
                      {msg.time}
                      {msg.fromMe && <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-8 py-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-secondary outline-none"
                />
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
