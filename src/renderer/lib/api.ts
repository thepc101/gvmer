import { supabase } from "./supabase";
import { fetchGameLogo } from "./groq";
import type { User } from "@supabase/supabase-js";

// ─── Auth ────────────────────────────────────────────────────

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      username,
      xp: 0,
      level: 1,
      status: "online",
    });
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "gvmer://reset-password",
  });
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  }).data.subscription.unsubscribe;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ─── Profile ─────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  const allowed = ["username", "avatar_url", "status"];
  const filtered: Record<string, any> = {};
  for (const [k, v] of Object.entries(updates)) {
    if (allowed.includes(k)) filtered[k] = v;
  }
  if (!Object.keys(filtered).length) return;

  const { data } = await supabase
    .from("profiles")
    .update(filtered)
    .eq("id", userId)
    .select()
    .single();
  return data;
}

// ─── Games ───────────────────────────────────────────────────

export async function getGames(userId: string) {
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", userId)
    .order("last_played", { ascending: false });
  return data || [];
}

export async function getGame(gameId: string) {
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();
  return data;
}

export async function addGameManual(userId: string, title: string, installPath: string, platform = "Other") {
  const id = `manual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const { data: existing } = await supabase
    .from("games")
    .select("id")
    .eq("id", id)
    .single();
  if (existing) return existing;

  const { data, error } = await supabase
    .from("games")
    .insert({
      id,
      user_id: userId,
      title,
      platform,
      install_path: installPath,
      developer: "Manual Add",
      hours_played: 0,
      achievements: 0,
      total_achievements: 0,
    })
    .select()
    .single();

  if (error) throw error;

  // Try to fetch logo via Groq in background
  fetchGameLogo(title).then((url) => {
    if (url) {
      supabase.from("games").update({ cover_image: url }).eq("id", id).then();
    }
  });

  return data;
}

export async function deleteGame(gameId: string) {
  await supabase.from("games").delete().eq("id", gameId);
}

export async function updateGameImage(gameId: string, url: string, type: "cover_image" | "hero_image") {
  const { data } = await supabase
    .from("games")
    .update({ [type]: url })
    .eq("id", gameId)
    .select()
    .single();
  return data;
}

export async function launchGame(installPath: string, launcherId?: string) {
  if (window.gvmer?.launchGame) {
    return window.gvmer.launchGame(installPath, launcherId);
  }
  return { success: false, error: "No launcher available" };
}

// ─── Settings ────────────────────────────────────────────────

export async function getSettings(userId: string) {
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .eq("user_id", userId);

  const defaults: Record<string, any> = {
    theme: "light",
    language: "en",
    launchOnStartup: false,
    minimizeToTray: true,
    notificationsEnabled: true,
    autoUpdateEnabled: true,
  };

  for (const row of data || []) {
    try {
      defaults[row.key] = JSON.parse(row.value);
    } catch {
      defaults[row.key] = row.value;
    }
  }
  return defaults;
}

export async function updateSetting(userId: string, key: string, value: any) {
  await supabase.from("settings").upsert(
    { user_id: userId, key, value: JSON.stringify(value) },
    { onConflict: "user_id, key" }
  );
}

// ─── Achievements & XP ───────────────────────────────────────

export async function getAchievements(userId: string) {
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked", { ascending: false })
    .order("title", { ascending: true });
  return data || [];
}

export async function getXpEvents(userId: string) {
  const { data } = await supabase
    .from("xp_events")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(50);
  return data || [];
}

// ─── Delete Account ──────────────────────────────────────────

export async function deleteAccount(userId: string) {
  const tables = ["games", "xp_events", "achievements", "settings"];
  for (const table of tables) {
    await supabase.from(table).delete().eq("user_id", userId);
  }
  await supabase.from("profiles").delete().eq("id", userId);
  await supabase.auth.admin.deleteUser(userId);
}

// ─── Storage (game images) ───────────────────────────────────

export async function uploadGameImage(
  userId: string,
  gameId: string,
  file: File,
  type: "cover_image" | "hero_image"
): Promise<string | null> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/${gameId}/${type}.${ext}`;

  const { error } = await supabase.storage
    .from("game-images")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("game-images")
    .getPublicUrl(path);

  const publicUrl = urlData?.publicUrl;
  if (publicUrl) {
    await updateGameImage(gameId, publicUrl, type);
  }
  return publicUrl;
}
