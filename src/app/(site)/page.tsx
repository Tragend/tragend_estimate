import Link from "next/link";
import { PhotoSlot } from "@/components/landing/PhotoSlot";
import { SampleDocsShowcase } from "@/components/landing/SampleDocsShowcase";
import { COMPANY } from "@/lib/estimate/company";

const MERITS = [
  {
    title: "項目ごとに分かれた、わかりやすいお見積もり",
    desc: "何に・どのくらい費用がかかるかが、一目で分かります。",
  },
  {
    title: "ご要望を整理した「プロジェクト構想書」つき",
    desc: "想定される機能や進め方をまとめた叩き台を一緒にお届け。何から作るかが見えてきます。",
  },
  {
    title: "相場より抑えた金額で、従来以上の品質",
    desc: "AIに精通したエンジニアが開発することで実現します。",
  },
  {
    title: "約1分で、その場でお届け",
    desc: "営業のやりとりは一切なし。気軽にお試しいただけます。",
  },
];

const DOMAINS = [
  { title: "レジャー施設のイベント予約サイト", price: "180万円〜", term: "約3ヶ月" },
  { title: "小規模企業の社内勤怠管理システム", price: "150万円〜", term: "2〜3ヶ月" },
  { title: "製造業向け図面管理システム", price: "200万円〜", term: "約3ヶ月" },
  { title: "ECサイト・在庫管理システム", price: "300万円〜", term: "約6ヶ月" },
];

const WHY = [
  {
    title: "AI駆動な開発体制",
    desc: "開発フローの各工程にAIを取り入れ、人は要件ヒアリングと品質レビューに集中。",
  },
  {
    title: "品質とセキュリティを担保",
    desc: "現役エンジニアが徹底レビューし、AI生成コードの信頼性を確保。",
  },
  {
    title: "代表がフロントに立つ",
    desc: "ご相談から運用まで代表が伴走。意思決定が速く、認識のズレを防ぐ。",
  },
  {
    title: "わかる言葉で小さく試す",
    desc: "専門用語に頼らず、現場の困りごとから段階的に形にする。",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero ＋ 事業形態セレクター（入口） */}
      <section className="bg-brand-50 pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr] md:p-10">
          {/* 左: コピー ＋ 入口 */}
          <div className="text-left">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground">
              1分で見積もりをお渡し！
            </span>
            <h1 className="mt-6 flex flex-col gap-3 font-bold tracking-tight text-foreground">
              <span className="text-3xl md:text-4xl">
                相場の約<span className="text-primary">1/3</span>の金額で、
              </span>
              <span className="text-3xl md:text-4xl">貴社だけのシステムを</span>
              <span className="text-3xl md:text-4xl">
                <span className="inline-block whitespace-nowrap border-b-4 border-primary/40 pb-1 font-black text-primary">
                  高速・高品質・高セキュリティ
                </span>
              </span>
              <span className="text-3xl md:text-4xl">で構築します。</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              最新AIを活用した現役エンジニアが、高品質なシステムを開発します。
              <br />
              まずはあなたのほしいものを教えてください。
            </p>

            <Link
              href="/estimate"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-primary-foreground hover:opacity-90"
            >
              今すぐ見積もり
              <span>→</span>
            </Link>

            <p className="mt-4 text-xs text-muted-foreground">
              ホームページ・LP制作のご相談は{" "}
              <a
                href={`${COMPANY.url}/contact`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                弊社ホームページのお問い合わせ
              </a>
              から。
            </p>
          </div>

          {/* 右: ヒーロー画像（背後のソフトな円＋影で接地させる） */}
          <div className="relative flex items-center justify-center">
            <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/60 blur-3xl" />
            <img
              src="/hero01-removebg-preview.png"
              alt="システム開発のイメージ"
              className="relative w-full max-w-md select-none drop-shadow-[0_18px_40px_rgba(37,99,235,0.18)]"
            />
          </div>
          </div>
        </div>
      </section>

      {/* 成果物（見積書）＋ メリット */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
            フォームで答えるだけで、
            <br className="md:hidden" />
            <span className="text-primary">見積書</span>と
            <span className="text-primary">プロジェクト構想書</span>をお届け
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            金額の見積もりだけでなく、ご要望を整理した「構想書（叩き台）」も一緒にお渡しします。
          </p>
          <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
            {/* 左: 見積書・構想書のサンプル（実物レイアウト） */}
            <SampleDocsShowcase />
            {/* 右: お客様のメリット */}
            <ul className="space-y-6">
              {MERITS.map((m) => (
                <li key={m.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{m.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/estimate"
              className="inline-flex rounded-2xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground hover:opacity-90"
            >
              まずは無料でシミュレーション
            </Link>
          </div>
        </div>
      </section>

      {/* 対応領域 */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
            どんなシステムにも対応
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            小さな業務改善から、中〜大規模システムまで幅広く対応します。
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DOMAINS.map((d) => (
              <div key={d.title} className="rounded-2xl border border-border bg-white p-4">
                <PhotoSlot label="サービス画像" aspect="4 / 3" />
                <div className="px-1 pt-4">
                  <h3 className="font-bold text-foreground">{d.title}</h3>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      金額 <span className="font-bold text-foreground">{d.price}</span>
                    </p>
                    <p className="text-muted-foreground">
                      納期 <span className="font-bold text-foreground">{d.term}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            ※ 金額・期間は目安です。ご要望の内容により変動します。
          </p>

          {/* ホームページ・LP制作は本シミュレーター対象外 → 自社サイトへ誘導 */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-white p-5 text-center">
            <p className="text-sm font-semibold text-foreground">
              ホームページ・ランディングページ制作をご検討の方へ
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              本シミュレーターはシステム開発向けです。ホームページ・LP制作のご相談は、
              <a
                href={`${COMPANY.url}/contact`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                弊社ホームページのお問い合わせ
              </a>
              より直接ご連絡ください。
            </p>
          </div>
        </div>
      </section>

      {/* なぜ安く・速いのか */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
            なぜ、安く・速く開発できるのか
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            AIを開発に組み込み、品質を落とさずコストを下げる。生成AIの速さと、現役エンジニアによる品質審査を両立しています。
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="flex gap-4 rounded-2xl border border-border bg-white p-6"
              >
                <PhotoSlot label="図" aspect="1 / 1" className="w-16 shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground">{w.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
            まずは1分、無料のお見積もりから。
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            ご依頼を見送ってもOK。お気軽にお試しください。
          </p>
          <Link
            href="/estimate"
            className="mt-8 inline-flex rounded-2xl bg-white px-10 py-4 text-base font-semibold text-primary hover:opacity-90"
          >
            無料で見積もりシミュレーション
          </Link>
        </div>
      </section>
    </>
  );
}
