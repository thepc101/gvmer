import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { getSession, getCurrentUser, signOut as apiSignOut } from "./api";
import * as api from "./api";

interface GameContextValue {
  user: User | null;
  userId: string;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getGames: () => ReturnType<typeof api.getGames>;
  getGame: (id: string) => ReturnType<typeof api.getGame>;
  addGameManual: (title: string, installPath: string, platform?: string) => ReturnType<typeof api.addGameManual>;
  deleteGame: (id: string) => ReturnType<typeof api.deleteGame>;
  updateGameImage: (id: string, url: string, type: "cover_image" | "hero_image") => ReturnType<typeof api.updateGameImage>;
  getProfile: () => ReturnType<typeof api.getProfile>;
  updateProfile: (updates: Record<string, any>) => ReturnType<typeof api.updateProfile>;
  getSettings: () => ReturnType<typeof api.getSettings>;
  updateSetting: (key: string, value: any) => ReturnType<typeof api.updateSetting>;
  getAchievements: () => ReturnType<typeof api.getAchievements>;
  getXpEvents: () => ReturnType<typeof api.getXpEvents>;
  deleteAccount: () => ReturnType<typeof api.deleteAccount>;
  uploadGameImage: (gameId: string, file: File, type: "cover_image" | "hero_image") => ReturnType<typeof api.uploadGameImage>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const u = await getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    getSession()
      .then((session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const userId = user?.id || "";

  const contextValue: GameContextValue = {
    user,
    userId,
    loading,
    signOut: async () => {
      await apiSignOut();
      setUser(null);
    },
    refreshUser,
    getGames: () => api.getGames(userId),
    getGame: api.getGame,
    addGameManual: (title, installPath, platform) => api.addGameManual(userId, title, installPath, platform),
    deleteGame: api.deleteGame,
    updateGameImage: (id, url, type) => api.updateGameImage(id, url, type),
    getProfile: () => api.getProfile(userId),
    updateProfile: (updates) => api.updateProfile(userId, updates),
    getSettings: () => api.getSettings(userId),
    updateSetting: (key, value) => api.updateSetting(userId, key, value),
    getAchievements: () => api.getAchievements(userId),
    getXpEvents: () => api.getXpEvents(userId),
    deleteAccount: () => api.deleteAccount(userId),
    uploadGameImage: (gameId, file, type) => api.uploadGameImage(userId, gameId, file, type),
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
