# Project: Tragend Portal (Estimation & Marketplace)

## 1. プロジェクト概要
株式会社Tragend（トラーゲント）の公式サイト。
AI受託開発のリード獲得を最大化する「見積もりシミュレーター」と、自社開発資産を販売する「マーケットプレイス」を統合したプラットフォーム。

## 2. デザイン・UX指針 (Design Reference)

### ① 見積もりシミュレーター (Inspired by: miryo.ai)
- **UI形式**: 1画面1質問のウィザード形式。直感的なカード選択UI。
- **演出**: `framer-motion` による滑らかな画面遷移と、金額のリアルタイム・カウントアップアニメーション。
- **導線**: 最後に連絡先を入力することで詳細な概算結果を表示する「リード獲得型」設計。

### ② ポートフォリオ・全体デザイン (Inspired by: hodalab.com)
- **雰囲気**: 「やんわり」とした清潔感のあるデザイン。
- **視覚要素**: 
    - 角丸（`rounded-2xl`）と繊細な影（`shadow-sm`）を多用。
    - 背景は純白を避け、オフホワイト（`bg-slate-50`など）で目に優しい配色。
    - 余白（Padding/Gap）を広めに取り、タイポグラフィの美しさを強調。

## 3. 技術スタック (Strict Stack)
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React (Icons)
- **Animation**: Framer Motion
- **State**: React Hook Form, Zustand
- **Backend**: Supabase (DB, Auth, Storage)
- **Payment**: Stripe (Checkout, Webhooks)

## 4. 機能要件

- **見積もりロジック**: Next.js/Supabase構成を標準($ 0)とし、外注技術（PHP等）やRAG構築などは加算設定。
- **マーケットプレイス**: Stripe連携によるデジタルコンテンツ販売機能。
- **ポートフォリオ**: 実績詳細から見積もりシミュレーターへの初期値引き継ぎ機能。

## 5. 実装指示 (Instruction for AI Agent)

1. **Theme Setup**: 
   - `globals.css` と `tailwind.config.ts` を設定し、`hodalab.com` のような淡い配色と角丸のベースを作成してください。
2. **Estimation Component**:
   - `miryo.ai` を参考に、ステップ遷移可能なカード選択コンポーネントを作成してください。（https://www.miryo.ai/）
   - `framer-motion` で各ステップが横からスライドインするアニメーションを実装してください。
3. **Portfolio Component**:
   - 実績一覧を `Grid` で表示し、ホバー時に微かに浮き上がる（`hover:-translate-y-1`）カードUIを作成してください。
4. **Data Fetching**:
   - Supabaseの `projects` テーブルから実績を取得し、ISR（Incremental Static Regeneration）で爆速表示させてください。