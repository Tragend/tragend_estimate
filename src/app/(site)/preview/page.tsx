// 書類テンプレート確認用プレビュー（http://localhost:3001/preview）。
// 本番の生成パイプラインとは独立。レイアウト確認用にサンプルデータで描画する。
import { priceEstimate } from "@/lib/estimate/pricing";
import { QuoteDocument } from "@/components/documents/QuoteDocument";
import { SpecDocument } from "@/components/documents/SpecDocument";
import { SAMPLE_REQUIREMENT, SAMPLE_META } from "@/lib/estimate/sample";

export default function PreviewPage() {
  const quote = priceEstimate(SAMPLE_REQUIREMENT);

  return (
    <div className="min-h-screen bg-slate-200 py-12">
      <div className="mx-auto max-w-[860px] px-4">
        <p className="mb-4 text-sm font-semibold text-slate-600">
          ① 見積書（サンプルデータ・レイアウト確認用）
        </p>
        <div className="overflow-hidden rounded shadow-lg">
          <QuoteDocument requirement={SAMPLE_REQUIREMENT} quote={quote} meta={SAMPLE_META} />
        </div>

        <p className="mb-4 mt-12 text-sm font-semibold text-slate-600">
          ② プロジェクト構想書（叩き台・サンプルデータ）
        </p>
        <div className="overflow-hidden rounded shadow-lg">
          <SpecDocument requirement={SAMPLE_REQUIREMENT} meta={SAMPLE_META} />
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          ※ これは確認用プレビューです。本番は回答データから生成し、PDF化してメール添付します。
        </p>
      </div>
    </div>
  );
}
