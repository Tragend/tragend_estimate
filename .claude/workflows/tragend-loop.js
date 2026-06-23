export const meta = {
  name: 'tragend-loop',
  description: 'Tragend Loop: 1開発フェーズを Plan→実装→クロスレビュー→機械ゲート で自動完走し、PR直前で停止する再利用エンジン',
  whenToUse: '開発フェーズ（A〜D等）をキックして実装〜検証まで自律で回したいとき。args に { phase, goal } を渡す。',
  phases: [
    { title: 'Plan', detail: 'Planner がフェーズを受入基準付きタスクに分解' },
    { title: 'Build', detail: 'タスクを直列実装（worktree無し・ブランチ1本）→機械ゲート→クロスレビュー' },
    { title: 'Report', detail: 'PR直前で停止し、人間承認用のサマリを返す' },
  ],
}

// ───────────────────────────────────────────────────────────────────
// Tragend Loop（再利用エンジン）
//
// 体制の正本: docs/loop/体制.md ／ レビュー観点: docs/loop/REVIEW_RULES.md
// 設計の正本: docs/SD/SD.md, docs/RD/RD.md ／ 全体ルール: CLAUDE.md（自動コンテキスト）
//
// 前提:
//  - 人間ゲート①（RD/SD確定・料金確定）が済んでいること。
//  - 直列・ブランチ1本で回す（worktree並列は「いつかやる」）。
//  - PR作成・マージは行わない。必ず PR 直前で停止し、人間が承認→デプロイ。
//
// 起動: 「フェーズAをやって」等の自然文で私が Workflow ツールから本スクリプトを起動。
//       args = { phase: 'A', goal: '連絡先取得（メール必須＋お客様情報→quotes更新）' }
//
// ※ 本ファイルは雛形。料金確定後の初回起動で実戦投入し、機械ゲートの正確なコマンド・
//    レビュー差し戻し回数・受入基準の粒度をハードニングする。
// ───────────────────────────────────────────────────────────────────

const KNOWLEDGE = 'CLAUDE.md・docs/SD/SD.md・docs/RD/RD.md・docs/loop/REVIEW_RULES.md・docs/loop/BACKLOG.md を必ず読むこと。'
const phaseName = (args && args.phase) || 'A'
const goal = (args && args.goal) || '(goal 未指定: BACKLOG.md から該当フェーズの目的を読み取る)'
const MAX_REWORK = 2 // 機械ゲート/レビュー不合格時の差し戻し上限

const TASKS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tasks'],
  properties: {
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'title', 'acceptance'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          acceptance: { type: 'array', items: { type: 'string' }, description: '受入基準（検証可能な形で）' },
          files: { type: 'array', items: { type: 'string' }, description: '想定変更ファイル' },
        },
      },
    },
  },
}

const GATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['pass', 'summary'],
  properties: {
    pass: { type: 'boolean', description: 'npm test 緑 かつ lint かつ build 通過なら true' },
    summary: { type: 'string' },
    failures: { type: 'array', items: { type: 'string' } },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lens', 'blocking', 'findings'],
  properties: {
    lens: { type: 'string' },
    blocking: { type: 'boolean', description: 'REVIEW_RULES.md の鉄則違反など、PRを止めるべき指摘があれば true' },
    findings: { type: 'array', items: { type: 'string' } },
  },
}

// ── Plan ──────────────────────────────────────────────────────────
phase('Plan')
const plan = await agent(
  `あなたは Planner。開発フェーズ「${phaseName}: ${goal}」を、実装可能な小タスクに分解し受入基準を付ける。${KNOWLEDGE}\n` +
  `既存実装（src/lib/estimate/ 等）の結線・実データ化が中心。タスクは直列実行できる順序で並べる。`,
  { phase: 'Plan', label: `plan:${phaseName}`, schema: TASKS_SCHEMA }
)
const tasks = (plan && plan.tasks) || []
log(`フェーズ${phaseName}: ${tasks.length} タスクに分解`)

// ── Build（直列・ブランチ1本。worktree並列はしない）──────────────────
phase('Build')
const results = []
for (const t of tasks) {
  let lastImpl = null
  let gate = null
  // 機械ゲートが緑になるまで（上限 MAX_REWORK 回）差し戻し
  for (let attempt = 0; attempt <= MAX_REWORK; attempt++) {
    const reworkNote = lastImpl && gate && !gate.pass
      ? `前回の機械ゲート失敗: ${(gate.failures || []).join('; ')}。これを直すこと。`
      : ''
    lastImpl = await agent(
      `タスク ${t.id}「${t.title}」を実装する。受入基準: ${(t.acceptance || []).join(' / ')}。${reworkNote}\n` +
      `${KNOWLEDGE}\n鉄則（特に「AIは金額=円を返さない／内部ラベルを顧客に出さない」）を厳守。直列作業なのでブランチ1本・他タスクのファイルは触らない。`,
      { phase: 'Build', label: `impl:${t.id}${attempt ? `#${attempt}` : ''}` }
    )
    gate = await agent(
      `機械ゲートを実行: \`npm test\`・\`npm run lint\`・\`npm run build\` を走らせ、全て通るか判定せよ。失敗は failures に列挙。`,
      { phase: 'Build', label: `gate:${t.id}${attempt ? `#${attempt}` : ''}`, schema: GATE_SCHEMA }
    )
    if (gate && gate.pass) break
  }

  // クロスレビュー（書いた本人は採点しない＝別ペルソナの既製レビュー役。3レンズ並列）
  const lenses = [
    { key: 'correctness', agentType: 'agent-skills:code-reviewer' },
    { key: 'security', agentType: 'agent-skills:security-auditor' },
    { key: 'test', agentType: 'agent-skills:test-engineer' },
  ]
  const verdicts = (await parallel(lenses.map((l) => () =>
    agent(
      `タスク ${t.id}「${t.title}」の実装をレビューせよ（レンズ: ${l.key}）。${KNOWLEDGE}\n` +
      `docs/loop/REVIEW_RULES.md の鉄則違反は blocking=true。受入基準 ${(t.acceptance || []).join(' / ')} を満たすか確認。`,
      { phase: 'Build', label: `review:${t.id}:${l.key}`, agentType: l.agentType, schema: VERDICT_SCHEMA }
    )
  ))).filter(Boolean)

  const blocking = verdicts.filter((v) => v.blocking)
  results.push({
    task: t,
    gatePassed: !!(gate && gate.pass),
    gateFailures: (gate && gate.failures) || [],
    blockingFindings: blocking.flatMap((v) => v.findings),
    allFindings: verdicts.flatMap((v) => `[${v.lens}] ${v.findings.join('; ')}`),
  })
}

// ── Report（PR直前で停止。人間が承認→デプロイ）────────────────────
phase('Report')
const green = results.filter((r) => r.gatePassed && r.blockingFindings.length === 0)
const needsHuman = results.filter((r) => !r.gatePassed || r.blockingFindings.length > 0)
log(`完了: ${green.length}/${results.length} タスクが「機械ゲート緑＋ブロッキング指摘なし」`)

return {
  phase: phaseName,
  goal,
  ready: needsHuman.length === 0,
  green: green.map((r) => r.task.id),
  needsHuman: needsHuman.map((r) => ({
    id: r.task.id,
    gatePassed: r.gatePassed,
    gateFailures: r.gateFailures,
    blockingFindings: r.blockingFindings,
  })),
  reviewNotes: results.map((r) => ({ id: r.task.id, findings: r.allFindings })),
  // 次の人間アクション: 内容を確認し、問題なければブランチを push → PR 作成 → 承認 → デプロイ。
  // 本ループは PR を作らない（外部公開＝不可逆のため必ず人間ゲート②を通す）。
}
