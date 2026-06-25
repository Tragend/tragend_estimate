// 実データの見積書を単体・余白なしで描画（Puppeteer がこのURLを開いてPDF化）。
// 連絡先が保存済みの行のみ描画する（ゲート）。
import { notFound } from "next/navigation";
import { priceEstimate } from "@/lib/estimate/pricing";
import { QuoteDocument } from "@/components/documents/QuoteDocument";
import { getQuoteDocData } from "@/lib/estimate/fetch";

export const dynamic = "force-dynamic";

export default async function PrintQuote({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getQuoteDocData(id);
  if (!data || !data.hasContact) notFound();
  const quote = priceEstimate(data.requirement);
  return <QuoteDocument requirement={data.requirement} quote={quote} meta={data.meta} />;
}
