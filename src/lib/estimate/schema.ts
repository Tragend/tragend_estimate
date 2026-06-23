// Claude tool use 用の入力スキーマ（EstimateRequirement を型で強制する）
import type Anthropic from "@anthropic-ai/sdk";

/** 機能の分類（完全固定 enum）。AI はこの中からのみ選ぶ。該当なしは「その他」。 */
export const FEATURE_CATEGORIES = [
  "会員・ユーザー管理",
  "申込・予約・フォーム",
  "決済・課金",
  "コンテンツ・データ管理",
  "外部サービス連携",
  "AI・自動化",
  "管理画面・ダッシュボード",
  "通知",
  "セキュリティ・権限",
  "基盤・インフラ",
  "その他",
] as const;

export const ESTIMATE_TOOL: Anthropic.Tool = {
  name: "submit_estimate",
  description:
    "問い合わせ内容から導出した、見積もりのための構造化案件要件を提出する。金額は一切含めない。",
  input_schema: {
    type: "object",
    properties: {
      projectTitle: { type: "string", maxLength: 40, description: "簡潔な件名（40字以内）" },
      summary: {
        type: "string",
        maxLength: 300,
        description:
          "背景・ゴールの要約（構想書の冒頭に載る。300字以内。すべて仮定形で、納期・金額・断定的なコミットを含めない）",
      },
      features: {
        type: "array",
        maxItems: 20,
        description:
          "必要な機能の一覧（最大20件）。明示されていない必須機能（認証・入力検証・管理画面・セキュリティ等）も補完する。20件を超える場合は重要なものに絞る。",
        items: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: [...FEATURE_CATEGORIES],
              description:
                "機能の分類。必ずこの enum の中から1つ選ぶ。該当が無ければ「その他」。",
            },
            name: { type: "string", maxLength: 30, description: "機能名（30字以内）" },
            description: {
              type: "string",
              maxLength: 120,
              description:
                "機能の詳細説明（120字以内）。仮定形で書き、納期・金額・特定製品名・断定的な保証を含めない。",
            },
            size: {
              type: "string",
              enum: ["S", "M", "L", "XL"],
              description: "規模。迷ったら大きめ。S=小, M=標準, L=重め, XL=複雑",
            },
            isHighRisk: {
              type: "boolean",
              description:
                "決済 / 外部連携 / AI-RAG / 規制業種 など高リスクなら true",
            },
          },
          required: ["category", "name", "description", "size", "isHighRisk"],
        },
      },
      fixedCosts: {
        type: "object",
        description:
          "固定費の要否判定（PM は常に計上するので含めない）。案件の性質から各項目の要否を真偽で判定する。金額は出力しない。",
        properties: {
          poc: {
            type: "boolean",
            description:
              "検証（PoC）が必要か。新規性・技術検証・複雑な統合を伴う案件のみ true。HP制作・定型的なサイト等は false。",
          },
          uiUx: {
            type: "boolean",
            description:
              "UI/UX設計・デザインが必要か。画面・デザインを伴う案件は true（HP制作も true）。API・バッチ・基盤のみなら false。",
          },
          qa: {
            type: "boolean",
            description:
              "テスト・QA対応を計上するか。通常は true。ごく小規模・単純な案件のみ false。",
          },
        },
        required: ["poc", "uiUx", "qa"],
      },
      assumptions: {
        type: "array",
        maxItems: 6,
        items: { type: "string", maxLength: 100 },
        description:
          "前提・確認したい点（最大6件・各100字以内）。確定事項ではなく「商談で確認したい点」を仮定形で書く。",
      },
      needsHearing: {
        type: "boolean",
        description: "大型/複雑で要詳細ヒアリングが望ましい場合 true",
      },
    },
    required: ["projectTitle", "summary", "features", "fixedCosts"],
  },
};
