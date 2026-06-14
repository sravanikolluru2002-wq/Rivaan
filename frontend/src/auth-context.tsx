import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { api, clearAuthData, getToken, markLoggedOut, setStoredUser, setToken } from "@/src/api";

type User = {
  id: string;
  phone: string;
  name: string;
  email?: string;
  address?: string;
  kyc_status?: string;
  is_admin?: boolean;
  onboarding_completed?: boolean;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthed: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authEpochRef = useRef(0);

  async function load() {
    const epoch = authEpochRef.current;
    console.log("[auth-flow] load start", { epoch });
    try {
      const token = await getToken();
      if (epoch !== authEpochRef.current) {
        console.log("[auth-flow] load ignored after epoch changed", { epoch, current: authEpochRef.current });
        return;
      }
      if (!token) {
        console.log("[auth-flow] load no token -> clear state");
        void clearAuthData();
        setUser(null);
        setAuthToken(null);
        return;
      }
      console.log("[auth-flow] load token found -> api.me");
      const u = await api.me();
      if (epoch !== authEpochRef.current) {
        console.log("[auth-flow] api.me ignored after epoch changed", { epoch, current: authEpochRef.current });
        return;
      }
      console.log("[auth-flow] load api.me success -> set authed state");
      setUser(u as User);
      setAuthToken(token);
    } catch (_e) {
      if (epoch !== authEpochRef.current) {
        console.log("[auth-flow] load error ignored after epoch changed", { epoch, current: authEpochRef.current });
        return;
      }
      console.log("[auth-flow] load error -> clear auth state");
      void clearAuthData();
      setUser(null);
      setAuthToken(null);
    } finally {
      if (epoch === authEpochRef.current) {
        console.log("[auth-flow] load finished", { epoch });
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function signIn(token: string, u: User) {
    const epoch = authEpochRef.current + 1;
    authEpochRef.current = epoch;
    console.log("[auth-flow] signIn start", { epoch });
    await setToken(token);
    await setStoredUser(u);
    if (epoch !== authEpochRef.current) {
      console.log("[auth-flow] signIn ignored after epoch changed", { epoch, current: authEpochRef.current });
      return;
    }
    console.log("[auth-flow] signIn set authed state");
    setUser(u);
    setAuthToken(token);
    setIsLoading(false);
  }

  function signOut() {
    authEpochRef.current += 1;
    console.log("[auth-flow] signOut start", { epoch: authEpochRef.current });
    markLoggedOut();
    setAuthToken(null);
    setUser(null);
    setIsLoading(false);
    console.log("[auth-flow] signOut state reset");
    void clearAuthData();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthed: !!authToken && !!user, signIn, signOut, refresh: load }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
