import type { Config } from "tailwindcss";

export default {
  content: ["./src/renderer/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        card: "#FFFFFF",
        foreground: "#111111",
        secondary: "#666666",
        border: "#ECECEC",
        accent: "#000000",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        nav: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.08em", fontWeight: "500" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.06)",
        dropdown: "0 8px 24px rgba(0,0,0,0.08)",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        250: "250ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
