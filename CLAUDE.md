# tragend_estimate — プロジェクト指示（自動コンテキスト）

見積もり自動生成システム（株式会社Tragend）。来訪者が自由文で要望→AIが機能分解→概算見積書＋構想書をメール送付するリード獲得型Webアプリ。
※ 全社ルール（セキュリティ等）は上位の `/Users/know/Tragend/CLAUDE.md` を継承する。

## 正本ドキュメント（迷ったらここを読む）

- 要件: `docs/RD/RD.md` ／ 設計（数値・スキーマ・実装方式）: `docs/SD/SD.md`
- 開発体制（Tragend Loop）: `docs/loop/体制.md`
- 進捗の栞（State）: `docs/loop/BACKLOG.md`
- レビュー観点: `docs/loop/REVIEW_RULES.md`

## 絶対原則（違反＝事故）

1. **AIは金額（円）を返さない。** 金額計算は100%コード側 `src/lib/estimate/pricing.ts`（決定的）。AI出力スキーマ `EstimateRequirement` に円を混入させない（ハルシネーション防止）。
2. **内部ラベルを顧客成果物に出さない。** `size`(S/M/L/XL)・`isHighRisk`・「地雷」・「×1.5」は社内専用。顧客が見るのは機能名・人日・金額・合計のみ。
3. **構想書は「叩き台（ドラフト）」。** 末尾に「確定要件は商談で人間が定める」旨の必須注記。AI出力にそのまま則って開発しない。
4. **秘密情報・LLM・DBは全てサーバ側**（Server Actions）。APIキーをクライアントに出さない。`.env*` はGit除外。
5. **Supabaseは公開APIから書き込みのみ・読み取り不可（RLS有効）。** 閲覧は管理コンソール。

## 開発体制（要点）

- 1開発フェーズ＝1 Workflow。実装→クロスレビュー(別ティア・別ペルソナ)→機械ゲート(`npm test`緑＋`npm run lint`＋`npm run build`)→PR作成で**停止**。マージはユーザー承認。
- **料金は未確定**：人間ゲート①（`grill-me`等で確定）が済むまで `pricing.ts` の**金額テストは書かない**。
- worktree並列は今やらない（直列・ブランチ1本）。

## テスト

- `npm test`（Vitest, `src/**/*.test.ts`）。決定的な純ロジックを優先的にテストする。
