import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
const model = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    if (!apiKey) {
      throw new Error("Missing VITE_GROQ_API_KEY. Add it to your .env file.");
    }
    client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }
  return client;
}

export async function fetchGameLogo(gameTitle: string): Promise<string | null> {
  try {
    const response = await getClient().chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a gaming database assistant. Given a game title, return ONLY a direct image URL for the game's logo or cover art from a public CDN (IGDB, SteamGridDB, or similar). Return nothing else — just the URL. If you cannot find one, return 'null'.",
        },
        { role: "user", content: gameTitle },
      ],
      max_tokens: 100,
      temperature: 0.1,
    });

    const url = response.choices?.[0]?.message?.content?.trim();
    if (!url || url === "null" || !url.startsWith("http")) return null;
    return url;
  } catch (err) {
    console.error("[groq] fetchGameLogo failed:", err);
    return null;
  }
}

export async function fetchGameDescription(gameTitle: string): Promise<string | null> {
  try {
    const response = await getClient().chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a gaming database assistant. Given a game title, return a short, professional 1-2 sentence description of the game. No markdown, no prefixes — just the text.",
        },
        { role: "user", content: gameTitle },
      ],
      max_tokens: 120,
      temperature: 0.3,
    });

    return response.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error("[groq] fetchGameDescription failed:", err);
    return null;
  }
}

export async function searchGamesAI(query: string): Promise<string[]> {
  try {
    const response = await getClient().chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a game search assistant. Given a search query, return a JSON array of up to 10 matching game titles. Return ONLY valid JSON, no other text. Example: [\"Game Title 1\", \"Game Title 2\"]",
        },
        { role: "user", content: query },
      ],
      max_tokens: 200,
      temperature: 0.2,
    });

    const text = response.choices?.[0]?.message?.content?.trim() || "[]";
    return JSON.parse(text);
  } catch (err) {
    console.error("[groq] searchGamesAI failed:", err);
    return [];
  }
}
