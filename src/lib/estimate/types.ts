// 見積もりエンジンの型定義
// AI が返す「構造化案件要件」と、ウィザード入力（メタ）の型。

export type Size = "S" | "M" | "L" | "XL";

/** AI が導出する個別機能 */
export interface Feature {
  /** 大分類（会員管理 / 決済 / 外部連携 / AI / セキュリティ など） */
  category: string;
  /** 機能名 */
  name: string;
  /** 機能の詳細説明（提案書にそのまま載る品質） */
  description: string;
  /** 規模判定。人日へ変換する（金額は AI ではなくコードが計算） */
  size: Size;
  /** 地雷カテゴリ（決済 / 外部連携 / AI-RAG / 規制業種）→ 人日割増の対象 */
  isHighRisk: boolean;
}

/**
 * 固定費の要否判定（AI が案件性質から真偽だけ返す。金額はコード側で確定）。
 * PM は全案件で常時計上するため、ここには含めない。
 */
export interface FixedCostJudgment {
  /** 検証（PoC）を計上するか。新規性・複雑性・技術検証を要する案件のみ true。HP制作など不要なら false */
  poc: boolean;
  /** UI/UX設計・デザインを計上するか。画面・デザインを伴う案件は true。API/バッチのみなら false */
  uiUx: boolean;
  /** テスト・QA対応を計上するか。通常 true。ごく小規模・単純な案件のみ false 可 */
  qa: boolean;
}

/** AI が返す構造化案件要件（金額は一切含まない） */
export interface EstimateRequirement {
  /** 件名 */
  projectTitle: string;
  /** 背景・ゴールの要約（提案書の案件概要に使用） */
  summary: string;
  /** AI が導出した機能リスト */
  features: Feature[];
  /** 固定費の要否判定（PM 以外）。未指定時はコード側の既定を使う */
  fixedCosts?: FixedCostJudgment;
  /** 前提・除外事項（任意） */
  assumptions?: string[];
  /** 大型/複雑で「要詳細ヒアリング」を推奨するか */
  needsHearing?: boolean;
}

/** ウィザードで集める入力（メタ情報 ＋ 自由文） */
export interface EstimateInput {
  businessType: "corporate" | "individual";
  /** 「作りたいシステム」自由文 */
  systemDescription: string;
  industry?: string;
  employeeSize?: string;
  deploymentTarget?: string;
  systemType?: string;
  /** 詳細（Q5 自由文） */
  detail?: string;
  /** 商談中・問い合わせ中のサービス（Q6 自由文） */
  ongoingServices?: string;
  desiredTimeline?: string;
  devices?: string[];
  budget?: string;
}
