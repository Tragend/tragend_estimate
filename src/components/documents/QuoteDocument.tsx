// 見積書（A4書類レイアウト）。画面プレビュー兼 PDF 生成元。
// 操作UIは持たない純粋な書類。Puppeteer でこのまま PDF 化できる前提で組む。
import { yen, DAILY_RATE, type Quote } from "@/lib/estimate/pricing";
import { COMPANY } from "@/lib/estimate/company";
import { QUOTE_DISCLAIMER } from "@/lib/estimate/notes";
import type { EstimateRequirement } from "@/lib/estimate/types";

export interface DocMeta {
  /** 宛名（例: 〇〇株式会社）。御中は自動付与 */
  addressee: string;
  /** 発行日（YYYY/MM/DD など整形済み文字列） */
  issueDate: string;
  /** 有効期限（整形済み文字列） */
  validUntil: string;
}

export function QuoteDocument({
  requirement,
  quote,
  meta,
}: {
  requirement: EstimateRequirement;
  quote: Quote;
  meta: DocMeta;
}) {
  return (
    <article className="mx-auto w-[794px] bg-white px-14 py-10 text-slate-900">
      {/* ヘッダ */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-[0.3em] text-slate-900">御見積書</h1>
          <div className="mt-6">
            <p className="text-lg font-semibold">
              <span className="border-b border-slate-400 pb-0.5">{meta.addressee}</span>
              <span className="ml-2 text-base">御中</span>
            </p>
          </div>
        </div>
        <div className="text-right text-xs leading-6 text-slate-600">
          <p>発行日：{meta.issueDate}</p>
          <p>有効期限：{meta.validUntil}</p>
        </div>
      </header>

      {/* 件名 ＋ 合計金額 */}
      <section className="mt-8">
        <p className="text-sm text-slate-500">件名</p>
        <p className="text-lg font-bold">{requirement.projectTitle}</p>
        <div className="mt-4 flex items-end gap-4 border-b-2 border-slate-800 pb-2">
          <span className="text-sm font-semibold text-slate-600">御見積金額（税込）</span>
          <span className="text-3xl font-bold tracking-tight">{yen(quote.total)}</span>
        </div>
      </section>

      {/* 発行元 */}
      <section className="mt-6 flex justify-end">
        <div className="w-72 text-xs leading-6 text-slate-700">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={COMPANY.logoSrc} alt={COMPANY.name} className="h-6 w-auto" />
            <span className="text-sm font-bold text-slate-900">{COMPANY.name}</span>
          </div>
          <p className="mt-1">{COMPANY.postalCode}</p>
          <p>{COMPANY.address}</p>
          <p>{COMPANY.email}</p>
        </div>
      </section>

      {/* 明細表 */}
      <section className="mt-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="border border-slate-300 px-3 py-1.5 text-left font-semibold">項目</th>
              <th className="w-24 border border-slate-300 px-3 py-1.5 text-right font-semibold">数量</th>
              <th className="w-28 border border-slate-300 px-3 py-1.5 text-right font-semibold">単価</th>
              <th className="w-32 border border-slate-300 px-3 py-1.5 text-right font-semibold">金額</th>
            </tr>
          </thead>
          <tbody>
            {quote.features.map((f, i) => (
              <tr key={i} className="break-inside-avoid">
                <td className="border border-slate-300 px-3 py-1.5">{f.name}</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">{f.manDays} 人日</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">{yen(DAILY_RATE)}</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">{yen(f.amount)}</td>
              </tr>
            ))}
            {quote.fixedCosts.map((c) => (
              <tr key={c.label} className="break-inside-avoid">
                <td className="border border-slate-300 px-3 py-1.5">{c.label}</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">1 式</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">{yen(c.amount)}</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">{yen(c.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 集計 */}
        <div className="mt-4 flex justify-end break-inside-avoid">
          <table className="w-72 text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-slate-600">小計（税抜）</td>
                <td className="py-1 text-right">{yen(quote.subtotal)}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">消費税（10%）</td>
                <td className="py-1 text-right">{yen(quote.tax)}</td>
              </tr>
              <tr className="border-t-2 border-slate-800">
                <td className="py-2 font-bold">合計（税込）</td>
                <td className="py-2 text-right text-lg font-bold">{yen(quote.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 備考 */}
      <section className="mt-8 break-inside-avoid border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold text-slate-500">備考</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{QUOTE_DISCLAIMER}</p>
      </section>
    </article>
  );
}
