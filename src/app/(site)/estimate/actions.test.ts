import { describe, it, expect } from "vitest";
import { submitEmail, submitCustomerInfo } from "./actions";

// 連絡先フェーズのサーバ側バリデーション単体テスト。
// quoteId=null（Supabase 未設定相当）でバリデーション分岐のみを検証する（DB 非依存）。

describe("submitEmail — メール検証", () => {
  it("不正な形式は拒否", async () => {
    expect(await submitEmail(null, "not-an-email")).toEqual({
      ok: false,
      error: "メールアドレスの形式が正しくありません",
    });
    expect((await submitEmail(null, "a@b")).ok).toBe(false);
    expect((await submitEmail(null, "")).ok).toBe(false);
  });

  it("正しい形式は通過（前後空白も許容）", async () => {
    expect(await submitEmail(null, "you@example.com")).toEqual({ ok: true });
    expect(await submitEmail(null, "  you@example.com  ")).toEqual({ ok: true });
  });
});

describe("submitCustomerInfo — お客様情報検証", () => {
  const base = {
    isIndividual: false,
    companyName: "サンプル株式会社",
    contactName: "山田太郎",
    phone: "03-1234-5678",
    agreedTerms: true,
  };

  it("全項目そろえば通過", async () => {
    expect(await submitCustomerInfo(null, base)).toEqual({ ok: true });
  });

  it("担当者名は必須", async () => {
    expect((await submitCustomerInfo(null, { ...base, contactName: " " })).ok).toBe(false);
  });

  it("電話番号は必須", async () => {
    expect((await submitCustomerInfo(null, { ...base, phone: "" })).ok).toBe(false);
  });

  it("法人は会社名必須", async () => {
    const r = await submitCustomerInfo(null, { ...base, isIndividual: false, companyName: "" });
    expect(r).toEqual({ ok: false, error: "会社名を入力してください" });
  });

  it("個人事業主は会社名なしでも通過", async () => {
    const r = await submitCustomerInfo(null, { ...base, isIndividual: true, companyName: "" });
    expect(r).toEqual({ ok: true });
  });

  it("規約同意は必須", async () => {
    const r = await submitCustomerInfo(null, { ...base, agreedTerms: false });
    expect(r).toEqual({ ok: false, error: "利用規約への同意が必要です" });
  });
});
