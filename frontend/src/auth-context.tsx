import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, clearToken, getToken, setToken } from "@/src/api";

type User = {
  id: string;
  phone: string;
  name: string;
  email?: string;
  address?: string;
  kyc_status?: string;
  is_admin?: boolean;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthed: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        return;
      }
      const u = await api.me();
      setUser(u as User);
    } catch (_e) {
      await clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function signIn(token: string, u: User) {
    await setToken(token);
    setUser(u);
  }

  async function signOut() {
    await clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthed: !!user, signIn, signOut, refresh: load }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
