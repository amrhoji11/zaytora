"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
} from "@/lib/services/account.service";
import { setUnauthorizedListener } from "@/lib/api/client";
import { forgetLastInvitation } from "@/components/studio/DraftBanner";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest, UserDto } from "@/types/api";

type AuthContextValue = {
  user: UserDto | null;
  // True only until the initial getCurrentUser() check resolves — lets
  // consumers (e.g. Header) avoid flashing "logged out" UI before that
  // first check has had a chance to come back.
  loading: boolean;
  login: (payload: LoginRequest) => Promise<UserDto>;
  register: (payload: RegisterRequest) => Promise<UserDto>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<UserDto>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setUser(await getCurrentUser());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    // Any 401 from anywhere in the app (see client.ts) reliably means the
    // session ended — clear `user` so every screen that reads useAuth()
    // (AdminLayout's redirect effect, the Header's logged-in state, the
    // dashboard's guest/demo banner) reflects it immediately instead of
    // carrying on as if still logged in while actions quietly keep failing.
    setUnauthorizedListener(() => setUser(null));
    return () => setUnauthorizedListener(null);
  }, []);

  async function login(payload: LoginRequest) {
    const current = await loginRequest(payload);
    setUser(current);
    return current;
  }

  async function register(payload: RegisterRequest) {
    const current = await registerRequest(payload);
    setUser(current);
    return current;
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    forgetLastInvitation();
  }

  async function updateProfile(payload: UpdateProfileRequest) {
    const current = await updateProfileRequest(payload);
    setUser(current);
    return current;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
