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
  if (!result.sourceId && result.source_id) {
    result.sourceId = result.source_id;
  }
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
    const obj = JSON.parse(raw) as Record<string, string>;

    if (obj[key] != null) return obj[key];

    // Compatibility alias between snake_case and camelCase.
    if (key === "sourceId" && obj.source_id != null) return obj.source_id;
    if (key === "source_id" && obj.sourceId != null) return obj.sourceId;

    return null;
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

export function getExternalCompanyIdFromUrl(): string | null {
  const rawHash = window.location.hash || "";
  const cleanedHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const tokenParam =
    window.location.search || cleanedHash.replace(/^\?/, "") || "";
  const params = new URLSearchParams(tokenParam);
  return params.get("externalCompanyId");
}

// Backwards-compatible alias
export function getCompanyExternalIdFromUrl(): string | null {
  return getExternalCompanyIdFromUrl();
}

// Read a single param preferring stored values, then URL parsing
export function getUrlParam(key: string): string | null {
  try {
    const stored = window.localStorage.getItem("urlParams");
    if (stored) {
      const obj = JSON.parse(stored || "{}") as Record<string, string>;
      if (obj && obj[key] != null) return String(obj[key]);
      if (key === "sourceId" && obj?.source_id != null) return String(obj.source_id);
      if (key === "source_id" && obj?.sourceId != null) return String(obj.sourceId);
    }
  } catch {
    // ignore and fallback
  }

  const params = parseUrlParams();
  if (key === "sourceId" && params.source_id != null) return params.source_id;
  if (key === "source_id" && params.sourceId != null) return params.sourceId;
  return params[key] ?? null;
}

// Returns only digits from sourceId/source_id so it can be used as wa.me target.
export function getWhatsappNumberFromSourceId(): string | null {
  const sourceId = getUrlParam("sourceId") ?? getUrlParam("source_id") ?? "";
  const sanitized = sourceId.replace(/\D/g, "");
  return sanitized || null;
}

// Return all stored params (or parsed URL if storage empty)
export function getAllStoredParams(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem("urlParams");
    if (raw) {
      const stored = JSON.parse(raw) as Record<string, string>;
      if (!stored.sourceId && stored.source_id) {
        stored.sourceId = stored.source_id;
      }
      return stored;
    }
  } catch {
    // fall through
  }
  return parseUrlParams();
}

// Persist important params to localStorage and clean the URL leaving only session_id
export function persistUrlParamsAndClean() {
  try {
    const parsed = parseUrlParams();
    const normalizedParams: Record<string, string> = { ...parsed };

    // Accept snake_case source id and normalize it to the camelCase key
    // used across the app storage.
    if (!normalizedParams.sourceId && normalizedParams.source_id) {
      normalizedParams.sourceId = normalizedParams.source_id;
    }

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
      "sourceId",
    ];

    const storedRaw = window.localStorage.getItem("urlParams");
    let stored: Record<string, string> = {};
    try {
      if (storedRaw) stored = JSON.parse(storedRaw);
    } catch {
      stored = {};
    }

    keys.forEach((k) => {
      if (normalizedParams[k] != null && normalizedParams[k] !== "") {
        stored[k] = normalizedParams[k];
      }
    });

    // if there was already a session_id keep it if none provided now
    if (!stored.session_id && normalizedParams.session_id) {
      stored.session_id = normalizedParams.session_id;
    }

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
    console.debug("persistUrlParamsAndClean failed", e);
  }
}
