// 金額計算（決定的・コード側）。AI は金額を返さない＝ハルシネーション防止。
import type { EstimateRequirement, Feature, FixedCostJudgment, Size } from "./types";

/** 人日単価（税抜） */
export const DAILY_RATE = 35_000;
/** 地雷カテゴリの人日割増係数 */
export const HIGH_RISK_MULTIPLIER = 1.5;
/** 消費税率 */
export const TAX_RATE = 0.1;

/**
 * 規模 → 人日（従来工数基準＝普通のエンジニアの工数。AI活用の速さは値引きせず粗利として握る）。
 * アトミック機能の目安: S=ログイン級1日 / M=会員登録級2日 / L=管理画面級3.5日 / XL=決済連携級6日。
 */
export const SIZE_MAN_DAYS: Record<Size, number> = {
  S: 1.0,
  M: 2.0,
  L: 3.5,
  XL: 6.0,
};

/** 固定費の金額（税抜・各1式）。PM は常時計上、他3項目は AI 判定で要否を決める。 */
export const FIXED_COST_AMOUNTS = {
  pm: 150_000,
  poc: 100_000,
  uiUx: 150_000,
  qa: 100_000,
} as const;

export const FIXED_COST_LABELS = {
  pm: "プロジェクトマネジメント",
  poc: "小さく検証（PoC）",
  uiUx: "UI/UX設計・デザイン",
  qa: "テスト・QA対応",
} as const;

/** PoC/UI-UX/QA が未指定のときの既定（PoC・UIは付けない安全側、QAは付ける） */
export const DEFAULT_FIXED_COST_JUDGMENT: FixedCostJudgment = {
  poc: false,
  uiUx: false,
  qa: true,
};

export interface AppliedFixedCost {
  label: string;
  /** 金額（税抜） */
  amount: number;
}

/**
 * 計上する固定費の明細を決定する。PM は常時計上（実質の最低ライン）。
 * PoC / UI・UX / QA は AI 判定（judgment）で付与。判定が無ければ既定を使う。
 */
export function fixedCostsFor(judgment?: FixedCostJudgment): AppliedFixedCost[] {
  const j = { ...DEFAULT_FIXED_COST_JUDGMENT, ...(judgment ?? {}) };
  const items: AppliedFixedCost[] = [
    { label: FIXED_COST_LABELS.pm, amount: FIXED_COST_AMOUNTS.pm },
  ];
  if (j.poc) items.push({ label: FIXED_COST_LABELS.poc, amount: FIXED_COST_AMOUNTS.poc });
  if (j.uiUx) items.push({ label: FIXED_COST_LABELS.uiUx, amount: FIXED_COST_AMOUNTS.uiUx });
  if (j.qa) items.push({ label: FIXED_COST_LABELS.qa, amount: FIXED_COST_AMOUNTS.qa });
  return items;
}

export interface PricedFeature extends Feature {
  /** 割増込みの人日 */
  manDays: number;
  /** 金額（税抜） */
  amount: number;
}

export interface Quote {
  features: PricedFeature[];
  devManDays: number;
  devCost: number;
  /** 計上された固定費の明細（PM ＋ AI 判定で付与された項目） */
  fixedCosts: AppliedFixedCost[];
  fixedCostTotal: number;
  /** 税抜 */
  subtotal: number;
  tax: number;
  /** 税込 */
  total: number;
}

/** 機能ごとの人日（地雷は割増） */
export function manDaysFor(feature: Feature): number {
  const base = SIZE_MAN_DAYS[feature.size];
  // スキーマで enum 強制済みだが、不正な size で NaN（金額崩壊）にならないよう明示的に弾く
  if (base === undefined) {
    throw new Error(`不正な規模(size)です: ${JSON.stringify(feature.size)}（機能: ${feature.name}）`);
  }
  return feature.isHighRisk ? base * HIGH_RISK_MULTIPLIER : base;
}

/** 構造化要件 → 見積もり金額 */
export function priceEstimate(req: EstimateRequirement): Quote {
  const features: PricedFeature[] = req.features.map((f) => {
    const manDays = manDaysFor(f);
    return { ...f, manDays, amount: Math.round(manDays * DAILY_RATE) };
  });
  const devManDays = features.reduce((s, f) => s + f.manDays, 0);
  const devCost = features.reduce((s, f) => s + f.amount, 0);
  const fixedCosts = fixedCostsFor(req.fixedCosts);
  const fixedCostTotal = fixedCosts.reduce((s, c) => s + c.amount, 0);
  const subtotal = devCost + fixedCostTotal;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  return {
    features,
    devManDays,
    devCost,
    fixedCosts,
    fixedCostTotal,
    subtotal,
    tax,
    total,
  };
}

/** ¥ 表示用フォーマット */
export function yen(n: number): string {
  return "¥" + n.toLocaleString("ja-JP");
}
