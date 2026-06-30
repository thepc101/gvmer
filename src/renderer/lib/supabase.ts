import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

export type Tables = {
  games: {
    id: string;
    user_id: string;
    title: string;
    cover_url: string | null;
    cover_image: string | null;
    hero_image: string | null;
    developer: string;
    platform: string;
    install_path: string | null;
    hours_played: number;
    achievements: number;
    total_achievements: number;
    last_played: string | null;
    launcher_id: string | null;
    created_at: string;
  };
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
    xp: number;
    level: number;
    status: string;
    created_at: string;
  };
  achievements: {
    id: string;
    user_id: string;
    title: string;
    description: string;
    icon: string;
    xp: number;
    unlocked: boolean;
    unlocked_at: number | null;
    created_at: string;
  };
  xp_events: {
    id: string;
    user_id: string;
    action: string;
    xp: number;
    timestamp: number;
    created_at: string;
  };
  settings: {
    user_id: string;
    key: string;
    value: string;
    created_at: string;
  };
};
