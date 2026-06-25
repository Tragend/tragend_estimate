import { getServerSupabase } from "../supabase/server";
import type { Quote } from "./pricing";
import type { EstimateInput, EstimateRequirement } from "./types";

/**
 * 生成した見積もりを Supabase の quotes テーブルに保存する。
 * - Supabase 未設定なら何もしない（null を返す）。
 * - 失敗してもユーザーフローは止めない（呼び出し側で握りつぶす）。
 * @returns 挿入された行の id（保存できなければ null）
 */
export async function saveQuote(
  input: EstimateInput,
  requirement: EstimateRequirement,
  quote: Quote,
  source: "ai" | "mock"
): Promise<string | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      business_type: input.businessType,
      system_description: input.systemDescription,
      industry: input.industry,
      employee_size: input.employeeSize,
      deployment_target: input.deploymentTarget,
      system_type: input.systemType,
      detail: input.detail,
      ongoing_services: input.ongoingServices,
      desired_timeline: input.desiredTimeline,
      devices: input.devices,
      budget: input.budget,
      project_title: requirement.projectTitle,
      summary: requirement.summary,
      features: quote.features,
      needs_hearing: requirement.needsHearing ?? false,
      source,
      requirement, // AI出力まるごと（PDF再生成元）

      dev_man_days: quote.devManDays,
      total_excl_tax: quote.subtotal,
      total_incl_tax: quote.total,
      status: "新規",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[saveQuote] 保存失敗:", error.message);
    return null;
  }
  return data.id as string;
}

/** お客様情報（連絡先フェーズの最後に保存） */
export interface CustomerInfo {
  /** 会社名（個人事業主は任意） */
  companyName?: string;
  isIndividual: boolean;
  contactName: string;
  phone: string;
  agreedTerms: boolean;
}

/**
 * 既存 quotes 行にメールアドレスを保存する（連絡先フェーズ Step1）。
 * Supabase 未設定なら何もしない（フローは止めない）。
 */
export async function updateQuoteEmail(quoteId: string, email: string): Promise<boolean> {
  const supabase = getServerSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from("quotes").update({ email }).eq("id", quoteId);
  if (error) {
    console.error("[updateQuoteEmail] 更新失敗:", error.message);
    return false;
  }
  return true;
}

/**
 * 既存 quotes 行にお客様情報を保存する（連絡先フェーズ Step2）。
 * Supabase 未設定なら何もしない（フローは止めない）。
 */
export async function updateQuoteCustomer(
  quoteId: string,
  info: CustomerInfo
): Promise<boolean> {
  const supabase = getServerSupabase();
  if (!supabase) return false;
  const { error } = await supabase
    .from("quotes")
    .update({
      company_name: info.companyName ?? null,
      is_individual: info.isIndividual,
      contact_name: info.contactName,
      phone: info.phone,
      agreed_terms: info.agreedTerms,
    })
    .eq("id", quoteId);
  if (error) {
    console.error("[updateQuoteCustomer] 更新失敗:", error.message);
    return false;
  }
  return true;
}
