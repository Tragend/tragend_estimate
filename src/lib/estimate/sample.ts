// 書類レイアウト確認用のサンプルデータ（プレビュー・印刷テストで共用）。
import type { EstimateRequirement } from "./types";
import type { DocMeta } from "@/components/documents/QuoteDocument";
import { QUOTE_DEFAULTS } from "./company";

export const SAMPLE_REQUIREMENT: EstimateRequirement = {
  projectTitle: "オンラインサロン向け会員管理システム",
  summary:
    "オンラインサロンの運営を一元管理するWebアプリケーションの開発を想定します。会員の入退会・プラン管理から、限定動画の配信、月額決済、外部メッセージサービスとの連携までを含み、運営の効率化と会員体験の向上を目指します。PC・スマートフォン両対応のレスポンシブ設計を前提とします。",
  features: [
    { category: "会員・ユーザー管理", name: "会員登録・ログイン", description: "メール認証による登録と、登録済みユーザーのログイン・セッション管理を想定します。", size: "M", isHighRisk: false },
    { category: "会員・ユーザー管理", name: "会員プラン管理", description: "複数の会員プランの作成・変更と、会員ごとのプラン割り当てを想定します。", size: "L", isHighRisk: false },
    { category: "決済・課金", name: "月額サブスクリプション決済", description: "決済サービスとの連携による継続課金処理を想定します。", size: "XL", isHighRisk: true },
    { category: "コンテンツ・データ管理", name: "動画コンテンツ管理", description: "限定動画のアップロード・管理と、会員向け配信を想定します。", size: "L", isHighRisk: false },
    { category: "外部サービス連携", name: "メッセージサービス連携", description: "外部メッセージサービスとの連携による通知配信を想定します。", size: "M", isHighRisk: true },
    { category: "管理画面・ダッシュボード", name: "管理者ダッシュボード", description: "会員状況・売上などを把握する管理者向け画面を想定します。", size: "L", isHighRisk: false },
    { category: "通知", name: "メール通知", description: "登録・決済・退会などのタイミングでのメール通知を想定します。", size: "M", isHighRisk: false },
    { category: "セキュリティ・権限", name: "入力検証・脆弱性対策", description: "全フォームの入力検証とXSS/CSRF等への対策を想定します。", size: "M", isHighRisk: false },
    { category: "基盤・インフラ", name: "レスポンシブUI・環境構築", description: "PC・スマートフォン対応のUIと、クラウド環境の構築を想定します。", size: "L", isHighRisk: false },
  ],
  assumptions: [
    "対応ブラウザ・端末の範囲は、ヒアリングで確定させていただきたいと考えています。",
    "決済サービスの選定は、ご要望と手数料を踏まえて相談のうえ決定したいと考えています。",
  ],
  fixedCosts: { poc: true, uiUx: true, qa: true },
  needsHearing: true,
};

export const SAMPLE_META: DocMeta = {
  addressee: "サンプル株式会社",
  issueDate: "2026/06/18",
  validUntil: `2026/07/18（発行日より${QUOTE_DEFAULTS.validityDays}日間）`,
};
