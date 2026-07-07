import React, { useEffect, useRef, useState } from "react";
import * as ReactDOMClient from "react-dom/client";
import { loadSession } from "../lib/auth";

declare global {
  interface Window {
    React?: typeof React;
    ReactDOM?: {
      createRoot: (container: Element | DocumentFragment) => unknown;
    };
    __dcBoot?: () => void;
  }
}

const RUNTIME_SCRIPT_ID = "dc-runtime-script";

const routeRewrites: Array<[RegExp, string]> = [
  [/Rivan%20Login\.dc\.html/g, "/login"],
  [/Rivan%20App\.dc\.html/g, "/app"],
  [/Rivan%20My%20Lands\.dc\.html/g, "/my-lands"],
  [/Rivan%20Visits\.dc\.html/g, "/visits"],
  [/Rivan%20Agent%20Dashboard\.dc\.html/g, "/agent-dashboard"],
  [/Rivan%20Admin%20Dashboard\.dc\.html/g, "/admin-dashboard"],
];

let runtimePromise: Promise<void> | null = null;

function rewriteNavigation(html: string) {
  let next = html;
  for (const [pattern, replacement] of routeRewrites) {
    next = next.replace(pattern, replacement);
  }
  return next;
}

function ensureRuntime() {
  if (window.__dcBoot) {
    return Promise.resolve();
  }
  if (runtimePromise) {
    return runtimePromise;
  }

  window.React = React;
  window.ReactDOM = {
    createRoot: ReactDOMClient.createRoot,
  };

  runtimePromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(RUNTIME_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.__dcBoot || existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load dc runtime")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = RUNTIME_SCRIPT_ID;
    script.src = "/support.js";
    script.async = false;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load dc runtime"));
    document.head.appendChild(script);
  });

  return runtimePromise;
}

function personalizeRenderedPage(host: HTMLDivElement, title: string) {
  const session = loadSession();
  const user = session?.user || {};
  const userName =
    String(user.name || user.full_name || user.display_name || "").trim() ||
    "Rivan User";
  const userRole = String(user.role || "").trim().toLowerCase();
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() || "")
    .join("") || "RU";

  if (title.includes("Agent")) {
    host.querySelectorAll("*").forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const text = node.textContent?.trim();
      if (text === "Sravani K") node.textContent = userName;
      if (text === "Super Agent") node.textContent = "Agent";
      if (text === "SK") node.textContent = initials;
    });
  }

  if (title.includes("Admin")) {
    host.querySelectorAll("*").forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const text = node.textContent?.trim();
      if (text === "Admin User") node.textContent = userName;
      if (text === "Super Admin") node.textContent = userRole === "admin" ? "Admin" : text;
    });
  }
}

type DcPageProps = {
  sourcePath: string;
  title: string;
};

export function DcPage({ sourcePath, title }: DcPageProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const managedHeadRef = useRef<HTMLElement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderPage() {
      setError(null);
      document.title = title;

      const host = hostRef.current;
      if (!host) return;

      managedHeadRef.current.forEach((node) => node.remove());
      managedHeadRef.current = [];
      host.innerHTML = "";

      await ensureRuntime();

      const response = await fetch(sourcePath, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Unable to load ${sourcePath}`);
      }

      const html = rewriteNavigation(await response.text());
      if (cancelled) return;

      const sourceDoc = new DOMParser().parseFromString(html, "text/html");
      const bodyMarkup = sourceDoc.body.innerHTML;
      const headBefore = new Set(Array.from(document.head.children));

      host.innerHTML = bodyMarkup;
      window.__dcBoot?.();
      personalizeRenderedPage(host, title);

      requestAnimationFrame(() => {
        if (cancelled) return;
        managedHeadRef.current = Array.from(document.head.children).filter(
          (node) => !headBefore.has(node),
        ) as HTMLElement[];
      });
    }

    renderPage().catch((err: unknown) => {
      if (cancelled) return;
      setError(err instanceof Error ? err.message : "Failed to render page");
    });

    return () => {
      cancelled = true;
      managedHeadRef.current.forEach((node) => node.remove());
      managedHeadRef.current = [];
      if (hostRef.current) {
        hostRef.current.innerHTML = "";
      }
    };
  }, [sourcePath, title]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "radial-gradient(140% 100% at 50% 0%, #eef4ea 0%, #e0ece0 55%, #d4e8d4 100%)",
          color: "#12351d",
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            width: "100%",
            padding: "28px",
            borderRadius: "24px",
            background: "#ffffff",
            boxShadow: "0 20px 40px rgba(18,53,29,.12)",
          }}
        >
          <h1 style={{ margin: "0 0 8px", fontSize: "24px" }}>Page render failed</h1>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="dc-react-page">
      <div ref={hostRef} className="dc-react-host" />
    </main>
  );
}
