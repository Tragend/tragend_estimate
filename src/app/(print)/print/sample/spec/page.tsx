// PDF化テスト用：構想書を単体・余白なしで描画（Puppeteer がこのURLを開く）。
import { SpecDocument } from "@/components/documents/SpecDocument";
import { SAMPLE_REQUIREMENT, SAMPLE_META } from "@/lib/estimate/sample";

export default function PrintSampleSpec() {
  return <SpecDocument requirement={SAMPLE_REQUIREMENT} meta={SAMPLE_META} />;
}
