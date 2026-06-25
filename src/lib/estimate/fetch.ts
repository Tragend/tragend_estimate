// quotes 行 → 書類描画に必要な要件＋メタ。PDF生成（印刷ルート・ダウンロード）で共用。
import { getServerSupabase } from "../supabase/server";
import { QUOTE_DEFAULTS } from "./company";
import type { EstimateRequirement } from "./types";
import type { DocMeta } from "@/components/documents/QuoteDocument";

export interface QuoteDocData {
  requirement: EstimateRequirement;
  meta: DocMeta;
  /** 連絡先が保存済みか（ダウンロード/印刷のゲート判定に使う） */
  hasContact: boolean;
}

function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

/** ダウンロード/印刷のゲート判定：連絡先が揃っているか（純関数・テスト対象） */
export function isContactComplete(row: {
  contact_name?: unknown;
  agreed_terms?: unknown;
}): boolean {
  return !!(row.contact_name && row.agreed_terms);
}

/** jsonb の requirement が描画に使える最低限の形か（壊れた行で落とさない・テスト対象） */
export function isRenderableRequirement(r: unknown): r is EstimateRequirement {
  return (
    !!r &&
    typeof r === "object" &&
    Array.isArray((r as EstimateRequirement).features) &&
    (r as EstimateRequirement).features.length > 0
  );
}

/**
 * 見積書・構想書の描画に必要なデータを取得する。
 * - Supabase 未設定 / 行なし / requirement 欠落なら null。
 * - サーバ専用（service_role）。クライアントから呼ばない。
 */
export async function getQuoteDocData(id: string): Promise<QuoteDocData | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("quotes")
    .select("requirement, company_name, contact_name, agreed_terms, created_at")
    .eq("id", id)
    .single();

  if (error || !data || !isRenderableRequirement(data.requirement)) return null;

  const created = data.created_at ? new Date(data.created_at as string) : new Date();
  const valid = new Date(created);
  valid.setDate(valid.getDate() + QUOTE_DEFAULTS.validityDays);

  const addressee =
    (data.company_name as string | null) ||
    (data.contact_name as string | null) ||
    "お客様";

  return {
    requirement: data.requirement,
    meta: {
      addressee,
      issueDate: fmtDate(created),
      validUntil: `${fmtDate(valid)}（発行日より${QUOTE_DEFAULTS.validityDays}日間）`,
    },
    hasContact: isContactComplete(data),
  };
}
