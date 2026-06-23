// プロジェクト構想書（叩き台）。A4書類レイアウト。画面プレビュー兼 PDF 生成元。
// 金額・人日・規模(size)は一切載せない（要件の面）。構造はコード固定、中身のみAI生成。
import { COMPANY } from "@/lib/estimate/company";
import { SPEC_DISCLAIMER } from "@/lib/estimate/notes";
import type { EstimateRequirement } from "@/lib/estimate/types";
import type { DocMeta } from "./QuoteDocument";

export function SpecDocument({
  requirement,
  meta,
}: {
  requirement: EstimateRequirement;
  meta: DocMeta;
}) {
  // category ごとにグルーピング（出現順を保持）
  const groups: { category: string; features: typeof requirement.features }[] = [];
  for (const f of requirement.features) {
    const g = groups.find((x) => x.category === f.category);
    if (g) g.features.push(f);
    else groups.push({ category: f.category, features: [f] });
  }

  return (
    <article className="mx-auto w-[794px] bg-white px-14 py-12 text-slate-900">
      {/* ヘッダ */}
      <header className="border-b-2 border-slate-800 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-slate-500">PROJECT OUTLINE</p>
            <h1 className="mt-1 text-2xl font-bold">プロジェクト構想書</h1>
            <p className="mt-1 text-xs text-slate-500">— 初期構想（叩き台） —</p>
          </div>
          <div className="text-right text-xs leading-6 text-slate-600">
            <p>発行日：{meta.issueDate}</p>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-base font-semibold">
            <span className="border-b border-slate-400 pb-0.5">{meta.addressee}</span>
            <span className="ml-2 text-sm">御中</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={COMPANY.logoSrc} alt={COMPANY.name} className="h-5 w-auto" />
            <span className="font-semibold">{COMPANY.name}</span>
          </div>
        </div>
      </header>

      {/* 件名・ご要望の整理 */}
      <section className="mt-8">
        <p className="text-xs text-slate-500">件名</p>
        <p className="text-lg font-bold">{requirement.projectTitle}</p>
        <h2 className="mt-6 mb-2 border-l-4 border-slate-800 pl-2 text-sm font-bold">
          ご要望の整理
        </h2>
        <p className="text-sm leading-7 text-slate-800">{requirement.summary}</p>
      </section>

      {/* 想定される機能 */}
      <section className="mt-8">
        <h2 className="mb-1 border-l-4 border-slate-800 pl-2 text-sm font-bold">
          想定される機能
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          ご要望から、こちらで必要と考えた機能を整理しました。過不足はヒアリングで調整します。
        </p>
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.category}>
              <div className="mb-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                {g.category}
              </div>
              <ul className="space-y-2">
                {g.features.map((f, i) => (
                  <li key={i} className="break-inside-avoid border-l-2 border-slate-200 pl-3">
                    <p className="text-sm font-semibold">{f.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{f.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 前提・確認したい点 */}
      {(requirement.assumptions?.length || requirement.needsHearing) && (
        <section className="mt-8">
          <h2 className="mb-2 border-l-4 border-slate-800 pl-2 text-sm font-bold">
            前提・確認したい点
          </h2>
          <ul className="space-y-1.5">
            {requirement.assumptions?.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-800">
                <span className="mt-0.5 text-slate-400">•</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
            {requirement.needsHearing && (
              <li className="flex gap-2 text-sm text-slate-800">
                <span className="mt-0.5 text-slate-400">•</span>
                <span className="leading-relaxed">
                  規模が大きいため、優先順位や段階的な進め方を含め、一度詳細なヒアリングをおすすめします。
                </span>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* 叩き台の注記 */}
      <section className="mt-10 break-inside-avoid rounded bg-slate-50 px-4 py-3">
        <p className="text-xs font-bold text-slate-700">本書の位置づけ</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{SPEC_DISCLAIMER}</p>
      </section>
    </article>
  );
}
