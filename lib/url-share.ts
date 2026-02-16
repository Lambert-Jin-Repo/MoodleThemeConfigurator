// ── Shareable URL encoding/decoding ──

import { ThemeTokens, DEFAULT_TOKENS } from './tokens';

export function encodeConfig(tokens: ThemeTokens): string {
  const diff: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (value !== (DEFAULT_TOKENS as unknown as Record<string, string | number | boolean>)[key]) {
      diff[key] = value;
    }
  }
  const json = JSON.stringify(diff);
  return btoa(json);
}

export function decodeConfig(encoded: string): Partial<ThemeTokens> | null {
  try {
    const json = atob(encoded);
    return JSON.parse(json) as Partial<ThemeTokens>;
  } catch {
    return null;
  }
}

export function getShareUrl(tokens: ThemeTokens): string {
  const encoded = encodeConfig(tokens);
  const url = new URL(window.location.href);
  url.searchParams.set('config', encoded);
  return url.toString();
}

export function parseUrlConfig(): Partial<ThemeTokens> | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const config = params.get('config');
  if (!config) return null;
  return decodeConfig(config);
}
