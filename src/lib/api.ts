// src/lib/api.ts
export class ApiError extends Error {
  status: number;
  url: string;
  method?: string;
  body?: any;

  constructor(message: string, opts: { status: number; url: string; method?: string; body?: any }) {
    super(message);
    this.status = opts.status;
    this.url = opts.url;
    this.method = opts.method;
    this.body = opts.body;
  }
}

export async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const r = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: init?.cache ?? 'no-store',
  });

  // intenta parsear JSON de error primero
  const raw = await r.text();
  const maybeJson = (() => {
    try { return raw ? JSON.parse(raw) : undefined; } catch { return undefined; }
  })();

  if (!r.ok) {
    throw new ApiError(
      `HTTP ${r.status} ${r.statusText}`,
      { status: r.status, url: typeof input === 'string' ? input : (input as any)?.url ?? '', method: init?.method, body: maybeJson ?? raw }
    );
  }

  // si la respuesta no tiene cuerpo, devuelve undefined
  if (!raw) return undefined as unknown as T;

  // si era JSON válido, úsalo; si no, intenta parsear como JSON (fallback)
  const data = maybeJson ?? (raw ? JSON.parse(raw) : undefined);
  return data as T;
}
