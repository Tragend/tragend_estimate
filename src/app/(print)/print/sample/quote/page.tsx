// PDF化テスト用：見積書を単体・余白なしで描画（Puppeteer がこのURLを開く）。
import { priceEstimate } from "@/lib/estimate/pricing";
import { QuoteDocument } from "@/components/documents/QuoteDocument";
import { SAMPLE_REQUIREMENT, SAMPLE_META } from "@/lib/estimate/sample";

export default function PrintSampleQuote() {
  const quote = priceEstimate(SAMPLE_REQUIREMENT);
  return <QuoteDocument requirement={SAMPLE_REQUIREMENT} quote={quote} meta={SAMPLE_META} />;
}
