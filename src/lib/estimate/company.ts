// 見積書・構想書の発行元情報（書類に印字する値）。
// ※ 会社の正本情報は /Users/know/Tragend/01_company/会社情報.md。
//   アプリは実行時にそのMarkdownを読めないため、書類用の値だけここに保持する。
//   【プレースホルダー】の項目は、確定したら実値に差し替える（変更はこの1か所だけ）。

export const COMPANY = {
  name: "株式会社Tragend",
  url: "https://tragend.com",
  postalCode: "〒104-0061",
  address: "東京都中央区銀座1丁目12番4号N&E BLD.6F",
  email: "info@tragend.com", // 【プレースホルダー】確定したら差し替え
  logoSrc: "/logo.png",
} as const;

/** 送信設定（メール実装フェーズで使用） */
export const MAIL = {
  /** お客様に送る見積書・構想書メールの CC（社内控え用） */
  salesCc: "sales@tragend.com",
} as const;

/** 見積書の既定メタ（有効期限の日数など） */
export const QUOTE_DEFAULTS = {
  validityDays: 30, // 有効期限（発行日からの日数）
} as const;
