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
