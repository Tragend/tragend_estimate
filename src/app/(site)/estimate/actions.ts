"use server";

import { generateRequirement } from "@/lib/estimate/generate";
import { priceEstimate, type Quote } from "@/lib/estimate/pricing";
import {
  saveQuote,
  updateQuoteEmail,
  updateQuoteCustomer,
  type CustomerInfo,
} from "@/lib/estimate/save";
import { getServerSupabase } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/notify/slack";
import type { EstimateInput, EstimateRequirement } from "@/lib/estimate/types";

export async function generateQuote(input: EstimateInput): Promise<{
  requirement: EstimateRequirement;
  quote: Quote;
  source: "ai" | "mock";
  quoteId: string | null;
}> {
  const { requirement, source } = await generateRequirement(input);
  const quote = priceEstimate(requirement);
  // Supabase 未設定なら null（保存スキップ）。保存失敗でフローは止めない。
  const quoteId = await saveQuote(input, requirement, quote, source).catch(
    () => null
  );
  return { requirement, quote, source, quoteId };
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

// ⚠️ 信頼境界: quoteId はクライアントから渡ってくる。更新はサーバの service_role
//   （RLS バイパス）で行うため、所有権バインディングが無いと IDOR になり得る。
//   現状は「保存のみ・読み戻し経路なし／id は推測困難な uuid」で実害を限定。
//   フェーズB（PDF を email/url キーで送付）に進む前に、署名トークン or セッション
//   cookie で quoteId の正当性を検証すること（docs/loop/BACKLOG.md フェーズB ブロッカー）。
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 連絡先フェーズ Step1: メールアドレスを保存（サーバ側でも検証） */
export async function submitEmail(
  quoteId: string | null,
  email: string
): Promise<SubmitResult> {
  const e = email.trim();
  if (!EMAIL_RE.test(e)) {
    return { ok: false, error: "メールアドレスの形式が正しくありません" };
  }
  // Supabase 未設定（quoteId=null）でも UI は進める。保存失敗でフローは止めない。
  if (quoteId) await updateQuoteEmail(quoteId, e).catch(() => false);
  return { ok: true };
}

/** 連絡先フェーズ Step2: お客様情報を保存（サーバ側でも必須項目を検証） */
export async function submitCustomerInfo(
  quoteId: string | null,
  info: CustomerInfo
): Promise<SubmitResult> {
  if (!info.contactName.trim()) return { ok: false, error: "ご担当者名を入力してください" };
  if (!info.phone.trim()) return { ok: false, error: "電話番号を入力してください" };
  if (!info.isIndividual && !info.companyName?.trim()) {
    return { ok: false, error: "会社名を入力してください" };
  }
  if (!info.agreedTerms) return { ok: false, error: "利用規約への同意が必要です" };

  if (quoteId) {
    await updateQuoteCustomer(quoteId, {
      companyName: info.companyName?.trim() || undefined,
      isIndividual: info.isIndividual,
      contactName: info.contactName.trim(),
      phone: info.phone.trim(),
      agreedTerms: info.agreedTerms,
    }).catch(() => false);

    // Slack へ新規リード通知（非ブロッキング。失敗しても顧客フローは止めない）
    try {
      const supabase = getServerSupabase();
      const { data } = supabase
        ? await supabase
            .from("quotes")
            .select("email, project_title, total_incl_tax")
            .eq("id", quoteId)
            .single()
        : { data: null };
      await notifyNewLead({
        quoteId,
        companyName: info.companyName?.trim() || undefined,
        contactName: info.contactName.trim(),
        email: data?.email ?? null,
        phone: info.phone.trim(),
        projectTitle: data?.project_title ?? null,
        totalInclTax: data?.total_incl_tax ?? null,
      });
    } catch {
      // 通知失敗は無視
    }
  }
  return { ok: true };
}
