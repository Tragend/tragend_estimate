# BACKLOG — tragend_estimate（State正本・進捗の栞）

> Tragend Loop の状態正本。文脈リセットに耐えるため、完了/未完了/受入基準をここに外部記録する。
> 体制は [体制.md](体制.md)、決定の記憶は Claude Code の `memory/`。最終更新: 2026-06-23。

---

## 人間ゲート

- [x] **ゲート①: 料金確定（2026-06-23・grill-me）** ← 単価¥35,000／size S1 M2 L3.5 XL6／地雷×1.5／固定費PM常時+PoC/UI/QAはAI判定／フロアなし／有効期限30日。SD §1・§3.2 と `pricing.ts`＋`pricing.test.ts` に反映済。
- [ ] **ゲート②: PR承認 → デプロイ**（各フェーズのPRごと）

## Phase 0 — 検証ゲート構築

- [x] #2 Vitest 導入（config `vitest.config.ts` / `npm test` 緑 / 安定スモークテスト `src/lib/estimate/yen.test.ts`）
- [x] #1 体制マニュアル `docs/loop/体制.md`
- [x] REVIEW_RULES.md（ナレッジ差し込み）
- [x] BACKLOG.md（本ファイル）
- [x] memory 正本化（体制・ロードマップ）
- [x] #6 Workflow雛形 `.claude/workflows/tragend-loop.js`（再利用ループエンジン・初回起動で実戦投入）
- [x] `CLAUDE.md`（repo直下・プロジェクト全体ルール）
- [x] #3 pricing.ts 単体テスト（`pricing.test.ts`・確定値を固定・14テスト緑）
- [ ] #4 CI（GitHub Actions: test+lint+build）← GitHub化後。**着手時に既存 tsc エラー `src/lib/pdf/render.ts:28`（@sparticuz/chromium v149 で `defaultViewport` が型から消えた）を潰す＝フェーズBで対応**
- [ ] #7 GitHub **private** repo ＋ `gh auth login`（ユーザーが `! gh auth login`）← public化は禁止・push手前で確認

## 残り開発フェーズ（1フェーズ＝1 Workflow・手動キック）

> 各フェーズ着手時に受入基準を具体化する。既存 `src/lib/estimate/` 等の結線・実データ化が中心。

- [x] **フェーズA**：連絡先取得（生成後の動線を「完成→メール必須→お客様情報→サンクス」に差し替え、見積もり画面表示を撤去）。branch `phase-a-contact`。`page.tsx`／`actions.ts`(`submitEmail`/`submitCustomerInfo`)／`save.ts`(`updateQuoteEmail`/`updateQuoteCustomer`)＋`actions.test.ts`。クロスレビュー=go。`npm test` 20件緑・lint clean。ローカルコミット済 `8af4c8e`（branch `phase-a-contact`）。**push/PR は #7 GitHub化後**
- [ ] **フェーズB**：PDF（見積書・構想書）に実データ接続。フェーズB着手前に潰すブロッカー:
  - [ ] **IDOR本対応**：`quoteId` をクライアント供給のまま service_role で更新している（`actions.ts`・`save.ts`）。署名トークン or セッションcookieで正当性検証。読み戻し経路ができる前に必須（クロスレビュー High）
  - [ ] `src/lib/pdf/render.ts:28` の `chromium.defaultViewport` 型エラー（v149 API変更）を実機検証しながら修正
  - [ ] `schema.sql` の `deck_pdf_url` と SD §3.4 の `spec_pdf_url` の名称不一致を正本化
  - [ ] 固定費がAI判定で項目数可変 → 見積書テンプレ `QuoteDocument.tsx` が可変行に対応しているか確認
  - [ ] 保存/送付失敗時のフォールバック・可観測性（`actions.ts` の `.catch(()=>false)` サイレント欠損／SD §3.5）
- [ ] **フェーズC**：Resend でメール送付（salesCc 社内控え・フォールバック・重複/レート制限）
- [ ] **フェーズD**：結果画面 → サンクス画面に差し替え

## いつかやる（将来マイルストーン・会社資産化の一部）

- [ ] worktree によるAIエージェント**並列実装**の仕組み
- [ ] 他社モデル（GPT/Gemini等）クロスレビューの配線
- [ ] CodeRabbit 併用（マネタイズ後）
- [ ] Cron による定期トリアージ（CI失敗・残バックログを朝に自動発見）
- [ ] 公開フォームのスパム/レート制限（`generateQuote` はLLM課金が発生／SD §4(a)。クロスレビュー Medium）
- [ ] リード行の status 遷移ガード（連絡先確定済み行への再更新の冪等性／クロスレビュー Low）
