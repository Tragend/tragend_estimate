// ローカル動作確認スクリプト: 入力 → AI(またはモック) → 金額 を表示する。
//   npm run estimate:try -- "作りたいシステムの説明文"
// ANTHROPIC_API_KEY を .env.local に設定すると実AI、無ければモックで動く。
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

import { generateRequirement } from "../src/lib/estimate/generate";
import { priceEstimate, yen } from "../src/lib/estimate/pricing";
import type { EstimateInput } from "../src/lib/estimate/types";
import { saveQuote } from "../src/lib/estimate/save";

async function main() {
  const description =
    process.argv[2] ??
    "オンラインサロン向けの会員管理システム。動画配信、決済、LINE連携をしたい。";

  const input: EstimateInput = {
    businessType: "corporate",
    systemDescription: description,
    industry: "サービス業",
    systemType: "WEBアプリ",
    budget: "100万円以下",
    devices: ["PC（Windows）", "スマートフォン（iOS）"],
  };

  console.log("■ 入力:", description, "\n");

  const { requirement, source } = await generateRequirement(input);
  console.log(
    `■ 抽出ソース: ${source === "ai" ? "Claude（本番）" : "モック（APIキー未設定）"}`
  );
  console.log("■ 件名:", requirement.projectTitle);
  console.log("■ 概要:", requirement.summary);
  if (requirement.needsHearing) console.log("■ ⚠ 要詳細ヒアリング推奨");
  console.log("");

  const quote = priceEstimate(requirement);

  console.log("■ 機能明細");
  for (const f of quote.features) {
    const risk = f.isHighRisk ? " ⚠地雷×1.5" : "";
    console.log(
      `  - [${f.category}] ${f.name}（${f.size}=${f.manDays}人日${risk}）→ ${yen(f.amount)}`
    );
  }
  console.log("");
  console.log(`  開発費: ${quote.devManDays}人日 → ${yen(quote.devCost)}`);
  for (const c of quote.fixedCosts) console.log(`  固定費 ${c.label}: ${yen(c.amount)}`);
  console.log(`  小計(税抜): ${yen(quote.subtotal)}`);
  console.log(`  消費税(10%): ${yen(quote.tax)}`);
  console.log(`  ──────────────`);
  console.log(`  税込合計: ${yen(quote.total)}`);

  const savedId = await saveQuote(input, requirement, quote, source);
  console.log(
    savedId
      ? `\n■ Supabaseに保存しました: id=${savedId}`
      : "\n■ Supabase未設定（保存スキップ）"
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
