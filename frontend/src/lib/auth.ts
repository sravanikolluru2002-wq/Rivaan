const BACKEND_URL =
  import.meta.env.EXPO_PUBLIC_BACKEND_URL ||
  "https://rivan.onrender.com";

const SESSION_KEY = "rivan_session";

export function getBackendUrl() {
  return BACKEND_URL.replace(/\/$/, "");
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

export async function postJson(path, body, token) {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail?.message || data.detail || "Request failed");
  }
  return data;
}

export async function getJson(path, token) {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail?.message || data.detail || "Request failed");
  return data;
}

export async function putJson(path, body, token) {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail?.message || data.detail || "Request failed");
  return data;
}
