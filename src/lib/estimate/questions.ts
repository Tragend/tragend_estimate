// ウィザードの設問定義（miryo踏襲・入口1本化＝事業形態から開始）
import type { EstimateInput } from "./types";

export type StepType = "single" | "multi" | "text";

export interface WizardStep {
  key: keyof EstimateInput;
  question: string;
  type: StepType;
  options?: string[];
  optional?: boolean;
  placeholder?: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    key: "businessType",
    question: "事業形態はどちらですか？",
    type: "single",
    options: ["企業・法人", "個人事業主"],
  },
  {
    key: "systemDescription",
    question: "作りたいシステムをお聞かせください",
    type: "text",
    placeholder: "例）オンラインサロン向けの会員管理システム。動画配信と決済をしたい。",
  },
  {
    key: "industry",
    question: "業種を教えてください",
    type: "single",
    options: [
      "製造業",
      "IT・情報通信業",
      "金融・保険業",
      "不動産業",
      "小売業",
      "卸売業",
      "建設業",
      "サービス業",
      "その他",
    ],
  },
  {
    key: "employeeSize",
    question: "従業員規模を教えてください",
    type: "single",
    options: ["1-10名", "11-50名", "51-100名", "101-500名", "500名以上"],
  },
  {
    key: "deploymentTarget",
    question: "システムの導入先はどちらですか？",
    type: "single",
    options: ["自社導入", "クライアント先導入"],
  },
  {
    key: "systemType",
    question: "システムの種類を選んでください。",
    type: "single",
    options: ["WEBアプリ", "スマホアプリ", "ソフトウェア", "決まっていない/その他"],
  },
  {
    key: "detail",
    question: "システムの詳細について、さらに詳しく教えてください。",
    type: "text",
    optional: true,
    placeholder: "ご回答を入力してください",
  },
  {
    key: "ongoingServices",
    question: "商談中や問い合わせ中のサービスはありますか？",
    type: "text",
    optional: true,
    placeholder: "ご回答を入力してください",
  },
  {
    key: "desiredTimeline",
    question: "導入希望時期はいつ頃を予定していますか？",
    type: "single",
    options: ["1ヶ月以内", "2-3ヶ月", "4-6ヶ月", "6ヶ月以上", "未定"],
  },
  {
    key: "devices",
    question: "対応が必要なデバイスを全て選択してください（複数選択可）",
    type: "multi",
    options: [
      "PC（Windows）",
      "PC（Mac）",
      "スマートフォン（iOS）",
      "スマートフォン（Android）",
      "タブレット",
    ],
  },
  {
    key: "budget",
    question: "想定している予算感を教えてください。",
    type: "single",
    options: [
      "50万円以下",
      "100万円以下",
      "200万円以下",
      "400万円以下",
      "700万円以下",
      "1000万円以下",
      "2000万円以下",
      "2000万円以上",
      "未定",
    ],
  },
];
