import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../ui/Logo";
import { signIn, signUp, sendPasswordReset } from "../../lib/api";

type AuthMode = "login" | "signup" | "forgot";

interface AuthPageProps {
  onAuthenticated: () => void;
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        onAuthenticated();
      } else if (mode === "signup") {
        if (!username.trim()) { setError("Username is required"); setLoading(false); return; }
        await signUp(email, password, username.trim());
        setMode("login");
        setError("Account created! Check your email to confirm, then sign in.");
      } else if (mode === "forgot") {
        await sendPasswordReset(email);
        setResetSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-sm px-6"
      >
        <div className="flex flex-col items-center mb-10">
          <Logo size={40} />
          <h1 className="text-2xl font-medium text-foreground mt-4 tracking-tight">gvmer</h1>
          <p className="text-sm text-secondary mt-1">The gaming operating system</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            {mode === "signup" && (
              <div>
                <label className="block text-xs text-foreground font-medium mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="gvmer"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-secondary/50 focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-foreground font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-secondary/50 focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="block text-xs text-foreground font-medium mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="··········"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-secondary/50 focus:outline-none focus:border-foreground transition-colors"
                  required
                  minLength={6}
                />
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs ${error.includes("Check your email") ? "text-green-600" : "text-red-500"}`}
              >
                {error}
              </motion.p>
            )}

            {resetSent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-secondary text-center py-4"
              >
                Reset link sent. Check your email.
              </motion.div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-foreground text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign In"
                  : mode === "signup"
                  ? "Create Account"
                  : "Send Reset Link"}
              </button>
            )}

            <div className="flex justify-center gap-4 text-xs text-secondary pt-2">
              {mode === "login" && (
                <>
                  <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="hover:text-foreground transition-colors underline underline-offset-4">
                    Create account
                  </button>
                  <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="hover:text-foreground transition-colors underline underline-offset-4">
                    Forgot password?
                  </button>
                </>
              )}
              {mode === "signup" && (
                <button type="button" onClick={() => { setMode("login"); setError(""); }} className="hover:text-foreground transition-colors underline underline-offset-4">
                  Already have an account? Sign in
                </button>
              )}
              {mode === "forgot" && (
                <button type="button" onClick={() => { setMode("login"); setError(""); setResetSent(false); }} className="hover:text-foreground transition-colors underline underline-offset-4">
                  Back to sign in
                </button>
              )}
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
