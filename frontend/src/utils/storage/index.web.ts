// Web storage (Metro picks index.ts on native).
// Helpers never throw: reads return `fallback`, writes return `false`.
// Values supported: string | number | boolean | null (JSON-serialized on disk).
// Usage: import { storage } from "@/src/utils/storage"; await storage.getItem(key, fallback);
// No Keychain on web — secure* helpers reuse AsyncStorage (no expo-secure-store).

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AssertNoExtras, StorageBase, StorageItemValue } from "./storage-base";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const COOKIE_KEYS = new Set(["rivan_token", "rivan_user_cache"]);

function canUseCookies() {
  return typeof document !== "undefined";
}

function readCookie(key: string) {
  if (!canUseCookies()) return null;
  const encodedKey = encodeURIComponent(key);
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${encodedKey}=`));
  return match ? decodeURIComponent(match.slice(encodedKey.length + 1)) : null;
}

function writeCookie<Value extends StorageItemValue>(key: string, value: Value) {
  if (!canUseCookies()) return;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

function deleteCookie(key: string) {
  if (!canUseCookies()) return;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(key)}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}

export class Storage extends StorageBase {
  // General KV — backed by AsyncStorage (its built-in web shim uses IndexedDB).
  async getItem<Fallback extends StorageItemValue>(
    key: string,
    fallback: Fallback,
  ): Promise<Fallback | null> {
    try {
      if (COOKIE_KEYS.has(key)) {
        const cookieValue = readCookie(key);
        if (cookieValue !== null) return this.retrieve(cookieValue, fallback);
      }

      const raw = await AsyncStorage.getItem(key);
      return this.retrieve(raw, fallback);
    } catch (e) {
      this.warn("getItem", key, e);
      return fallback;
    }
  }

  async setItem<Value extends StorageItemValue>(
    key: string,
    value: Value,
  ): Promise<boolean> {
    try {
      if (COOKIE_KEYS.has(key)) writeCookie(key, value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      this.warn("setItem", key, e);
      return false;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      if (COOKIE_KEYS.has(key)) deleteCookie(key);
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      this.warn("removeItem", key, e);
      return false;
    }
  }

  // Browsers have no Keychain — secure* helpers fall through to AsyncStorage.
  async secureGet<Fallback extends StorageItemValue>(
    key: string,
    fallback: Fallback,
  ): Promise<Fallback | null> {
    return this.getItem(key, fallback);
  }

  async secureSet<Value extends StorageItemValue>(
    key: string,
    value: Value,
  ): Promise<boolean> {
    return this.setItem(key, value);
  }

  async secureRemove(key: string): Promise<boolean> {
    return this.removeItem(key);
  }
}

export const storage = new Storage();

// Compile-time guard: any new method must be declared in storage-base.ts first.
type _NoExtras = AssertNoExtras<Exclude<keyof Storage, keyof StorageBase>>;
