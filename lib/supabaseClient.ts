import { createClient } from "@supabase/supabase-js";

// ─── Database types ───────────────────────────────────────────────────────────

export type BusinessStatus =
  | "new"
  | "sent"
  | "negotiating"
  | "closed"
  | "irrelevant";

export interface Business {
  id: number;
  slug: string;
  name: string;
  category: string;
  phone: string;
  address: string | null;
  rating: number;
  review_count: number;
  status: BusinessStatus;
  created_at: string;
}

// ─── Lazy client — safe at build time when env vars aren't present ────────────

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support both key names — PUBLISHABLE_KEY (new Supabase) and ANON_KEY (classic)
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
}
