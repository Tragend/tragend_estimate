// 入力 → Claude（tool use）→ EstimateRequirement
// ANTHROPIC_API_KEY が無いローカル環境ではモックを返す（簡単に動作確認できるように）。
import Anthropic from "@anthropic-ai/sdk";
import { ESTIMATE_TOOL, FEATURE_CATEGORIES } from "./schema";
import type { EstimateInput, EstimateRequirement } from "./types";

const MODEL = "claude-sonnet-4-6";

const SYSTEM = `あなたは受託開発会社「株式会社Tragend」の見積もりアシスタントです。
顧客の問い合わせ内容から、開発に必要な機能を漏れなく洗い出し、構造化してください。
出力は顧客に渡す「プロジェクト構想書（叩き台）」と「見積書」に使われます。

# 機能の洗い出し
- 明示されていなくても、実装に必須の機能（認証・権限管理・入力バリデーション・管理画面・エラー処理・通知・セキュリティ対応 等）を補完して含める。
- 各機能の規模(size)は、迷ったら大きめに見積もる（曖昧さ＝リスク）。規模の目安: S=ログイン級 / M=会員登録級 / L=管理画面級 / XL=決済連携級。
- 決済 / 外部サービス連携 / AI・RAG / 規制業種（金融・医療など）に該当する機能は isHighRisk=true。

# 固定費の要否判定(fixedCosts)
- PM（プロジェクトマネジメント）は全案件で計上するため判定しない。
- poc: 新規性・技術検証・複雑な統合を伴う案件のみ true。HP制作・定型サイト等は false。
- uiUx: 画面・デザインを伴う案件は true（HP制作も true）。API・バッチ・基盤のみなら false。
- qa: 通常は true。ごく小規模・単純な案件のみ false。
- ここでも金額・円は一切出力しない（要否の真偽のみ）。

# 分類(category)の固定ルール
- category は必ず次のいずれか1つから選ぶ（新しい分類を作らない）:
  ${FEATURE_CATEGORIES.join(" / ")}
- どれにも当てはまらない場合のみ「その他」を使う。

# 文章ルール（構想書は「叩き台」。勝手なコミットを禁止する）
- すべて仮定形で書く（「〜と想定します」「〜を検討します」「〜を確認させてください」）。
- 🚫 金額・円・人日は一切書かない（規模は size のみで表す）。
- 🚫 確定的な納期・期間・日付を書かない（「2週間で納品」等は禁止）。
- 🚫 断定的なコミット・保証を書かない（「必ず」「保証します」「対応可能です」→ 想定形に）。
- 🚫 特定の外部製品名・サービス名・他社名を断定しない（「Stripeを使用」→「決済サービスとの連携を想定」）。
- 🚫 過剰なセキュリティ保証をしない（「完全に安全」等は禁止）。
- isHighRisk は社内判定用のフラグ。その判定理由や社内用語（地雷 等）を description / summary に書かない。
- summary は300字以内、各 description は120字以内に収める。

# 体裁
- summary と description は、そのまま顧客に見せられる丁寧で中立的な日本語で書く。
- assumptions は「商談で確認したい点」を仮定形で最大6件。
- 必ず submit_estimate ツールを使って構造化データで返すこと。`;

function buildUserContent(input: EstimateInput): string {
  const lines = [
    `# 問い合わせ内容`,
    `事業形態: ${input.businessType === "corporate" ? "企業・法人" : "個人事業主"}`,
    `作りたいシステム: ${input.systemDescription}`,
  ];
  if (input.industry) lines.push(`業種: ${input.industry}`);
  if (input.employeeSize) lines.push(`従業員規模: ${input.employeeSize}`);
  if (input.deploymentTarget) lines.push(`導入先: ${input.deploymentTarget}`);
  if (input.systemType) lines.push(`システム種類: ${input.systemType}`);
  if (input.detail) lines.push(`詳細: ${input.detail}`);
  if (input.ongoingServices)
    lines.push(`商談中/問い合わせ中のサービス: ${input.ongoingServices}`);
  if (input.desiredTimeline) lines.push(`導入希望時期: ${input.desiredTimeline}`);
  if (input.devices?.length) lines.push(`対応デバイス: ${input.devices.join(", ")}`);
  if (input.budget) lines.push(`予算感: ${input.budget}`);
  return lines.join("\n");
}

export async function generateRequirement(
  input: EstimateInput
): Promise<{ requirement: EstimateRequirement; source: "ai" | "mock" }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { requirement: mockRequirement(input), source: "mock" };
  }
  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM,
    tools: [ESTIMATE_TOOL],
    tool_choice: { type: "tool", name: ESTIMATE_TOOL.name },
    messages: [{ role: "user", content: buildUserContent(input) }],
  });
  const block = msg.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error("AI が構造化データ（tool_use）を返しませんでした");
  }
  return { requirement: block.input as EstimateRequirement, source: "ai" };
}

/** ANTHROPIC_API_KEY なしでもパイプライン全体を確認できるモック出力 */
export function mockRequirement(input: EstimateInput): EstimateRequirement {
  return {
    projectTitle: `${input.systemDescription.slice(0, 24)} 開発`,
    summary: `【モック出力】${input.systemDescription}（ANTHROPIC_API_KEY を設定すると実際のAI抽出に切り替わります）`,
    features: [
      { category: "会員・ユーザー管理", name: "会員登録機能", description: "メール・パスワードで新規登録できる機能を想定します。", size: "M", isHighRisk: false },
      { category: "会員・ユーザー管理", name: "ログイン機能", description: "登録済みユーザーの認証・セッション管理を想定します。", size: "S", isHighRisk: false },
      { category: "決済・課金", name: "決済機能", description: "決済サービスとの連携による支払い処理を想定します。", size: "XL", isHighRisk: true },
      { category: "外部サービス連携", name: "LINE連携機能", description: "外部メッセージサービスとの連携・通知を想定します。", size: "M", isHighRisk: true },
      { category: "セキュリティ・権限", name: "入力バリデーション", description: "全フォームの入力検証とエラー処理を想定します。", size: "S", isHighRisk: false },
    ],
    fixedCosts: { poc: true, uiUx: true, qa: true },
    assumptions: ["これは ANTHROPIC_API_KEY 未設定時のモック出力です。"],
    needsHearing: false,
  };
}
