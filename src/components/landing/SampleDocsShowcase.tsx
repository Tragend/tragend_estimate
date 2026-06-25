// ランディング用：サンプルの見積書・構想書を縮小して斜めに重ねたショーケース。
// /preview と同じ書類コンポーネント＋サンプルデータを使う（実物のレイアウトをそのまま見せる）。
import type { CSSProperties, ReactNode } from "react";
import { priceEstimate } from "@/lib/estimate/pricing";
import { QuoteDocument } from "@/components/documents/QuoteDocument";
import { SpecDocument } from "@/components/documents/SpecDocument";
import { SAMPLE_REQUIREMENT, SAMPLE_META } from "@/lib/estimate/sample";

const THUMB_W = 250; // 表示幅(px)
const THUMB_H = 354; // A4比(1:1.414)でほぼ1ページ分を見せる
const DOC_W = 794; // QuoteDocument/SpecDocument の実寸幅

/** 794px の書類を縮小し、1ページ分にクリップして見せるサムネイル */
function DocThumb({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white ${className}`}
      style={{ width: THUMB_W, height: THUMB_H, ...style }}
    >
      <div
        style={{
          width: DOC_W,
          transform: `scale(${THUMB_W / DOC_W})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function SampleDocsShowcase() {
  const quote = priceEstimate(SAMPLE_REQUIREMENT);
  return (
    <div className="relative mx-auto h-[400px] w-full max-w-[360px]">
      {/* 背面：プロジェクト構想書 */}
      <div className="absolute left-0 top-9 -rotate-3">
        <DocThumb className="shadow-lg">
          <SpecDocument requirement={SAMPLE_REQUIREMENT} meta={SAMPLE_META} />
        </DocThumb>
      </div>

      {/* 前面：見積書 */}
      <div className="absolute right-0 top-0 rotate-3">
        <DocThumb className="shadow-2xl">
          <QuoteDocument requirement={SAMPLE_REQUIREMENT} quote={quote} meta={SAMPLE_META} />
        </DocThumb>
      </div>
    </div>
  );
}
