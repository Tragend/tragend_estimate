// 新規リード発生時に Slack へ通知する（Incoming Webhook）。
// SLACK_WEBHOOK_URL が未設定なら何もしない。失敗してもフローは止めない（呼び出し側で握りつぶす）。

export interface LeadNotice {
  quoteId: string | null;
  companyName?: string;
  contactName: string;
  email?: string | null;
  phone: string;
  projectTitle?: string | null;
  totalInclTax?: number | null;
}

const SITE_URL = process.env.SITE_URL ?? "https://estimate.tragend.com";

export async function notifyNewLead(n: LeadNotice): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const yen =
    n.totalInclTax != null ? "¥" + n.totalInclTax.toLocaleString("ja-JP") : "—";
  const links = n.quoteId
    ? `見積書PDF: ${SITE_URL}/download/quote/${n.quoteId}\n構想書PDF: ${SITE_URL}/download/spec/${n.quoteId}`
    : "(DB未保存のためリンクなし)";

  const text = [
    "🎉 *新規リード（見積もり完了）*",
    `会社: ${n.companyName || "—"}`,
    `担当: ${n.contactName}`,
    `メール: ${n.email || "—"}`,
    `電話: ${n.phone}`,
    `件名: ${n.projectTitle || "—"}`,
    `概算(税込): ${yen}`,
    links,
  ].join("\n");

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}
