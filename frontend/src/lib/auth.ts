const BACKEND_URL =
  import.meta.env.EXPO_PUBLIC_BACKEND_URL ||
  "https://rivan.onrender.com";

const SESSION_KEY = "rivan_session";
let refreshPromise = null;

export function getBackendUrl() {
  return BACKEND_URL.replace(/\/$/, "");
}

export function getWebSocketUrl(token) {
  const base = getBackendUrl().replace(/^http/, "ws");
  return `${base}/ws/live?token=${encodeURIComponent(token || "")}`;
}

let liveUpdatesCapabilityPromise = null;

export async function supportsLiveUpdates() {
  if (!liveUpdatesCapabilityPromise) {
    liveUpdatesCapabilityPromise = fetch(`${getBackendUrl()}/api/health`, {
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const data = await response.json().catch(() => ({}));
        return data?.live_updates_enabled === true;
      })
      .catch(() => false);
  }
  return liveUpdatesCapabilityPromise;
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function redirectToLogin() {
  if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

function invalidateSession() {
  clearSession();
  redirectToLogin();
}

export async function logoutSession() {
  const session = loadSession();
  const refreshToken = session?.refresh_token;
  try {
    if (refreshToken) {
      await fetch(`${getBackendUrl()}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } catch {
    // Best-effort logout; clear local session even if the network is unavailable.
  } finally {
    clearSession();
  }
}

export async function refreshStoredSession() {
  const current = loadSession();
  const refreshToken = current?.refresh_token;
  if (!refreshToken) {
    invalidateSession();
    throw new Error("Missing refresh token");
  }

  if (!refreshPromise) {
    refreshPromise = fetch(`${getBackendUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.access_token) {
          throw new ApiError(
            data.detail?.message || data.detail || "Unable to restore session",
            response.status,
            data,
          );
        }
        saveSession(data);
        return data;
      })
      .catch((error) => {
        invalidateSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function restoreSession() {
  const session = loadSession();
  if (!session?.refresh_token) return null;
  if (session?.access_token) return session;
  return refreshStoredSession();
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function performJsonRequest(path, options = {}, token) {
  const { method = "GET", body } = options;
  const response = await fetch(`${getBackendUrl()}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export async function requestJson(path, options = {}, token) {
  let activeToken = token;
  let { response, data } = await performJsonRequest(path, options, activeToken);

  if (response.status === 401) {
    const storedSession = loadSession();
    if (storedSession?.refresh_token) {
      const refreshedSession = await refreshStoredSession();
      activeToken = refreshedSession?.access_token || activeToken;
      ({ response, data } = await performJsonRequest(path, options, activeToken));
    }
  }

  if (response.status === 401) {
    invalidateSession();
    throw new Error("Session expired");
  }

  if (!response.ok) {
    throw new ApiError(
      data.detail?.message || data.detail || "Request failed",
      response.status,
      data,
    );
  }
  return data;
}

export async function postJson(path, body, token) {
  return requestJson(path, { method: "POST", body }, token);
}

export async function getJson(path, token) {
  return requestJson(path, { method: "GET" }, token);
}

export async function putJson(path, body, token) {
  return requestJson(path, { method: "PUT", body }, token);
}
