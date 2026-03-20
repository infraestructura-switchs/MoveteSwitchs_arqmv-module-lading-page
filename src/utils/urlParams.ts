export function parseUrlParams(): Record<string, string> {
  const rawHash = window.location.hash || "";
  const cleanedHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const tokenParam =
    window.location.search || cleanedHash.replace(/^\?/, "") || "";
  const params = new URLSearchParams(tokenParam);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function storeUrlParams(params: Record<string, string>) {
  try {
    window.localStorage.setItem("urlParams", JSON.stringify(params));
  } catch {
    /* ignore storage errors */
  }
}

export function getStoredUrlParam(key: string): string | null {
  try {
    const raw = window.localStorage.getItem("urlParams");
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj[key] ?? null;
  } catch {
    return null;
  }
}

export function getCompanyIdFromUrl(): number | null {
  const rawHash = window.location.hash || "";
  const cleanedHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const tokenParam =
    window.location.search || cleanedHash.replace(/^\?/, "") || "";
  const params = new URLSearchParams(tokenParam);
  const id = params.get("externalCompanyId");
  return id ? Number(id) : null;
}

export function getCompanyExternalIdFromUrl(): string | null {
  const rawHash = window.location.hash || "";
  const cleanedHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const tokenParam =
    window.location.search || cleanedHash.replace(/^\?/, "") || "";
  const params = new URLSearchParams(tokenParam);
  return params.get("externalCompanyId");
}

// Read a single param preferring stored values, then URL parsing
export function getUrlParam(key: string): string | null {
  try {
    const stored = window.localStorage.getItem("urlParams");
    if (stored) {
      const obj = JSON.parse(stored || "{}");
      if (obj && obj[key] != null) return String(obj[key]);
    }
  } catch {
    // ignore and fallback
  }

  const params = parseUrlParams();
  return params[key] ?? null;
}

// Return all stored params (or parsed URL if storage empty)
export function getAllStoredParams(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem("urlParams");
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through
  }
  return parseUrlParams();
}

// Persist important params to localStorage and clean the URL leaving only session_id
export function persistUrlParamsAndClean() {
  try {
    const parsed = parseUrlParams();
    const keys = [
      "token",
      "userToken",
      "externalCompanyId",
      "productNameCompany",
      "qr",
      "mesa",
      "templateLanding",
      "session_id",
      "Delivery",
    ];

    const storedRaw = window.localStorage.getItem("urlParams");
    let stored: Record<string, string> = {};
    try {
      if (storedRaw) stored = JSON.parse(storedRaw);
    } catch {
      stored = {};
    }

    keys.forEach((k) => {
      if (parsed[k] != null && parsed[k] !== "") {
        stored[k] = parsed[k];
      }
    });

    // if there was already a session_id keep it if none provided now
    if (!stored.session_id && parsed.session_id) stored.session_id = parsed.session_id;

    try {
      window.localStorage.setItem("urlParams", JSON.stringify(stored));
    } catch {
      // ignore storage failures
    }

    // Replace the URL leaving only session_id (if present)
    const s = stored.session_id;
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    if (s) url.searchParams.set("session_id", s);
    window.history.replaceState({}, "", url.toString());
  } catch (e) {
    // don't break app if something fails
    // eslint-disable-next-line no-console
    console.debug("persistUrlParamsAndClean failed", e);
  }
}
