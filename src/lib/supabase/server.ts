import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * サーバー専用 Supabase クライアント（service_role 使用）。
 * - 環境変数が未設定なら null を返す（ローカルで Supabase 無しでも動かすため）。
 * - service_role キーは強力なので **絶対にクライアントへ出さない**（NEXT_PUBLIC を付けない / サーバーでのみ使用）。
 */
export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
