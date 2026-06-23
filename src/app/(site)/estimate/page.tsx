"use client";

import { useState, type ReactNode } from "react";
import { WIZARD_STEPS, type WizardStep } from "@/lib/estimate/questions";
import type { EstimateInput } from "@/lib/estimate/types";
import { generateQuote, submitEmail, submitCustomerInfo } from "./actions";

type Answers = Record<string, string | string[]>;
type Phase = "wizard" | "generating" | "completed" | "contact" | "thanks";

function buildInput(a: Answers): EstimateInput {
  const s = (k: string) => (a[k] as string) || undefined;
  return {
    businessType: a.businessType === "個人事業主" ? "individual" : "corporate",
    systemDescription: (a.systemDescription as string) || "",
    industry: s("industry"),
    employeeSize: s("employeeSize"),
    deploymentTarget: s("deploymentTarget"),
    systemType: s("systemType"),
    detail: s("detail"),
    ongoingServices: s("ongoingServices"),
    desiredTimeline: s("desiredTimeline"),
    devices: (a.devices as string[]) || [],
    budget: s("budget"),
  };
}

export default function EstimatePage() {
  const [phase, setPhase] = useState<Phase>("wizard");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const step = WIZARD_STEPS[stepIndex];
  const total = WIZARD_STEPS.length;
  const value = answers[step.key];
  const isIndividual = answers.businessType === "個人事業主";

  const canProceed =
    step.type === "single"
      ? !!value
      : step.type === "text"
        ? step.optional || !!(value as string)?.trim()
        : true; // multi

  function setAnswer(key: string, v: string | string[]) {
    setAnswers((prev) => ({ ...prev, [key]: v }));
  }

  async function goNext() {
    if (stepIndex < total - 1) {
      setStepIndex((i) => i + 1);
    } else {
      await submitWith(answers);
    }
  }

  function selectSingle(opt: string) {
    const next = { ...answers, [step.key]: opt };
    setAnswers(next);
    if (stepIndex < total - 1) setStepIndex((i) => i + 1);
    else submitWith(next);
  }

  function toggleMulti(opt: string) {
    const cur = (answers[step.key] as string[]) || [];
    setAnswer(
      step.key,
      cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]
    );
  }

  async function submitWith(a: Answers) {
    setPhase("generating");
    setError(null);
    try {
      const res = await generateQuote(buildInput(a));
      setQuoteId(res.quoteId);
      setPhase("completed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成に失敗しました");
      setPhase("wizard");
    }
  }

  if (phase === "generating") {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
          <p className="mt-6 text-lg font-semibold text-foreground">
            お見積もりを作成しています…
          </p>
          <p className="mt-1 text-sm text-muted-foreground">AIが要件を整理しています</p>
        </div>
      </Shell>
    );
  }

  if (phase === "completed") {
    return (
      <Shell>
        <EmailGate quoteId={quoteId} onDone={() => setPhase("contact")} />
      </Shell>
    );
  }

  if (phase === "contact") {
    return (
      <Shell>
        <ContactForm
          quoteId={quoteId}
          isIndividual={isIndividual}
          onDone={() => setPhase("thanks")}
        />
      </Shell>
    );
  }

  if (phase === "thanks") {
    return (
      <Shell>
        <ThanksView />
      </Shell>
    );
  }

  return (
    <Shell>
      {/* progress */}
      <div className="mb-8">
        <p className="mb-2 text-center text-sm text-muted-foreground">
          欲しいシステムの見積が1分で！
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
        {step.question}
      </h2>

      <StepBody
        step={step}
        value={value}
        onSelectSingle={selectSingle}
        onToggleMulti={toggleMulti}
        onText={(v) => setAnswer(step.key, v)}
      />

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {/* nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          ← 戻る
        </button>
        {step.type !== "single" && (
          <div className="flex gap-3">
            {step.type === "text" && step.optional && (
              <button
                onClick={goNext}
                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-primary"
              >
                特になし
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!canProceed}
              className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              {stepIndex === total - 1 ? "見積もりを作成" : "次へ"}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}

function StepBody({
  step,
  value,
  onSelectSingle,
  onToggleMulti,
  onText,
}: {
  step: WizardStep;
  value: string | string[] | undefined;
  onSelectSingle: (opt: string) => void;
  onToggleMulti: (opt: string) => void;
  onText: (v: string) => void;
}) {
  if (step.type === "text") {
    return (
      <textarea
        rows={4}
        value={(value as string) || ""}
        onChange={(e) => onText(e.target.value)}
        placeholder={step.placeholder}
        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    );
  }

  return (
    <div className="space-y-3">
      {step.options!.map((opt) => {
        const selected =
          step.type === "single"
            ? value === opt
            : ((value as string[]) || []).includes(opt);
        return (
          <button
            key={opt}
            onClick={() =>
              step.type === "single" ? onSelectSingle(opt) : onToggleMulti(opt)
            }
            className={`flex w-full items-center justify-between rounded-xl border bg-white px-5 py-4 text-left text-sm font-medium transition-all hover:border-primary ${
              selected ? "border-primary ring-2 ring-primary/30" : "border-border"
            }`}
          >
            <span className="text-foreground">{opt}</span>
            {step.type === "multi" && (
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  selected ? "border-primary bg-primary text-white" : "border-slate-300"
                }`}
              >
                {selected ? "✓" : ""}
              </span>
            )}
            {step.type === "single" && <span className="text-primary">→</span>}
          </button>
        );
      })}
    </div>
  );
}

/** 生成完了 → メール必須入力（金額は画面に出さない＝SD §3.5 Step1） */
function EmailGate({
  quoteId,
  onDone,
}: {
  quoteId: string | null;
  onDone: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await submitEmail(quoteId, email);
    setSubmitting(false);
    if (res.ok) onDone();
    else setError(res.error);
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
        ✓
      </div>
      <h2 className="text-2xl font-bold text-foreground">お見積もりが完成しました！</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        概算のお見積書とプロジェクト構想書（叩き台）を、メールにてお送りします。
        受け取るメールアドレスをご入力ください。
      </p>

      <div className="mx-auto mt-8 max-w-md text-left">
        <label className="mb-1.5 block text-sm font-semibold text-foreground">
          メールアドレス <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit()}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "送信中…" : "この内容で進む"}
        </button>
      </div>
    </div>
  );
}

/** お客様情報入力（担当者名・電話・会社名・規約同意）＝SD §3.5 Step2 */
function ContactForm({
  quoteId,
  isIndividual,
  onDone,
}: {
  quoteId: string | null;
  isIndividual: boolean;
  onDone: () => void;
}) {
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await submitCustomerInfo(quoteId, {
      companyName: companyName || undefined,
      isIndividual,
      contactName,
      phone,
      agreedTerms,
    });
    setSubmitting(false);
    if (res.ok) onDone();
    else setError(res.error);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground">お客様情報のご入力</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        担当者より、メールにて成果物をお送りします。
      </p>

      <div className="mt-8 space-y-5">
        <Field label="ご担当者名" required>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            autoComplete="name"
            className={inputCls}
          />
        </Field>

        <Field label={isIndividual ? "屋号・会社名（任意）" : "会社名"} required={!isIndividual}>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            autoComplete="organization"
            className={inputCls}
          />
        </Field>

        <Field label="電話番号" required>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={inputCls}
          />
        </Field>

        <label className="flex items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
          />
          <span>
            利用規約・プライバシーポリシーに同意します
            <span className="text-destructive"> *</span>
          </span>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "送信中…" : "送信する"}
        </button>
      </div>
    </div>
  );
}

function ThanksView() {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
        ✉
      </div>
      <h2 className="text-2xl font-bold text-foreground">ありがとうございました</h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        ご入力いただいたメールアドレス宛に、概算のお見積書とプロジェクト構想書（叩き台）をお送りします。
        数分経っても届かない場合は、迷惑メールフォルダもご確認ください。
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        内容のご相談・日程調整は、メール本文のご案内よりお進みいただけます。
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}
