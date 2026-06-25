// 実データの構想書を単体・余白なしで描画（Puppeteer がこのURLを開いてPDF化）。
// 連絡先が保存済みの行のみ描画する（ゲート）。
import { notFound } from "next/navigation";
import { SpecDocument } from "@/components/documents/SpecDocument";
import { getQuoteDocData } from "@/lib/estimate/fetch";

export const dynamic = "force-dynamic";

export default async function PrintSpec({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getQuoteDocData(id);
  if (!data || !data.hasContact) notFound();
  return <SpecDocument requirement={data.requirement} meta={data.meta} />;
}
