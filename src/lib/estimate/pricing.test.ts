import { describe, it, expect } from "vitest";
import {
  manDaysFor,
  fixedCostsFor,
  priceEstimate,
  SIZE_MAN_DAYS,
  DAILY_RATE,
} from "./pricing";
import type { EstimateRequirement, Feature } from "./types";

// 料金確定（人間ゲート①・2026-06-23）後の決定的金額テスト。機械ゲートの本体。
// 確定モデル: 単価¥35,000 / size人日 S1 M2 L3.5 XL6 / 地雷×1.5 /
//   固定費 PM常時+PoC/UI/QAはAI判定 / フロアなし / 税10% / docs/SD/SD.md §1・§3.2

const f = (size: Feature["size"], isHighRisk = false): Feature => ({
  category: "その他",
  name: "x",
  description: "x",
  size,
  isHighRisk,
});

describe("manDaysFor — 規模→人日（地雷×1.5）", () => {
  it("確定テーブル S=1 / M=2 / L=3.5 / XL=6", () => {
    expect(SIZE_MAN_DAYS).toEqual({ S: 1.0, M: 2.0, L: 3.5, XL: 6.0 });
  });
  it("地雷でない機能は素の人日", () => {
    expect(manDaysFor(f("XL"))).toBe(6.0);
  });
  it("地雷機能は×1.5（XL=9人日）", () => {
    expect(manDaysFor(f("XL", true))).toBe(9.0);
    expect(manDaysFor(f("M", true))).toBe(3.0);
  });
  it("不正な size は NaN にせず例外を投げる（金額崩壊の防止）", () => {
    expect(() => manDaysFor(f("XXL" as Feature["size"]))).toThrow();
  });
});

describe("fixedCostsFor — PM常時+AI判定", () => {
  it("PM は常に計上される", () => {
    const items = fixedCostsFor({ poc: false, uiUx: false, qa: false });
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({ label: "プロジェクトマネジメント", amount: 150_000 });
  });
  it("4項目フルで合計¥500,000", () => {
    const items = fixedCostsFor({ poc: true, uiUx: true, qa: true });
    expect(items.reduce((s, c) => s + c.amount, 0)).toBe(500_000);
  });
  it("HP制作想定（PoC/QA off・UI on）= PM+UI = ¥300,000", () => {
    const items = fixedCostsFor({ poc: false, uiUx: true, qa: false });
    expect(items.reduce((s, c) => s + c.amount, 0)).toBe(300_000);
  });
  it("判定未指定なら既定（PoC/UI off・QA on）= PM+QA = ¥250,000", () => {
    const items = fixedCostsFor();
    expect(items.reduce((s, c) => s + c.amount, 0)).toBe(250_000);
  });
});

describe("priceEstimate — 確定モデルの実額", () => {
  it("会員制＋決済＋LINE連携（固定費フル）= 税込¥1,166,000", () => {
    const req: EstimateRequirement = {
      projectTitle: "t",
      summary: "s",
      features: [
        f("M"), // 会員登録 2
        f("S"), // ログイン 1
        f("XL", true), // 決済 6×1.5=9
        f("M", true), // LINE連携 2×1.5=3
        f("S"), // 入力検証 1
      ],
      fixedCosts: { poc: true, uiUx: true, qa: true },
    };
    const q = priceEstimate(req);
    expect(q.devManDays).toBe(16); // 2+1+9+3+1
    expect(q.devCost).toBe(560_000); // 16×35,000
    expect(q.fixedCostTotal).toBe(500_000);
    expect(q.subtotal).toBe(1_060_000);
    expect(q.tax).toBe(106_000);
    expect(q.total).toBe(1_166_000);
  });

  it("HP制作（PoC/QA off・UI on）= 税込¥657,250", () => {
    const req: EstimateRequirement = {
      projectTitle: "t",
      summary: "s",
      features: [f("L"), f("M"), f("M"), f("S")], // 3.5+2+2+1 = 8.5
      fixedCosts: { poc: false, uiUx: true, qa: false },
    };
    const q = priceEstimate(req);
    expect(q.devManDays).toBe(8.5);
    expect(q.devCost).toBe(297_500); // 8.5×35,000
    expect(q.fixedCostTotal).toBe(300_000); // PM+UI
    expect(q.subtotal).toBe(597_500);
    expect(q.total).toBe(657_250); // 597,500×1.1
  });

  it("単価定数は¥35,000", () => {
    expect(DAILY_RATE).toBe(35_000);
  });
});
