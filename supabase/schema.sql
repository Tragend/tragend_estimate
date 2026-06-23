-- Tragend 見積もりシステム: quotes テーブル
-- Supabase ダッシュボード → SQL Editor に貼り付けて実行してください。

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- 入力（ウィザード）
  business_type text,
  system_description text,
  industry text,
  employee_size text,
  deployment_target text,
  system_type text,
  detail text,
  ongoing_services text,
  desired_timeline text,
  devices text[],
  budget text,

  -- AI出力
  project_title text,
  summary text,
  features jsonb,
  needs_hearing boolean default false,
  source text,                          -- 'ai' | 'mock'

  -- 計算結果
  dev_man_days numeric,
  total_excl_tax integer,
  total_incl_tax integer,

  -- 連絡先（後フェーズで更新）
  email text,
  company_name text,
  is_individual boolean,
  contact_name text,
  phone text,
  agreed_terms boolean,

  -- 成果物
  quote_pdf_url text,
  deck_pdf_url text,

  -- 営業管理（コンソールで更新）
  status text not null default '新規'   -- 新規 / 対応中 / 商談化 / 失注
);

-- RLS: 公開(anon)からの読み書きは一切許可しない。
-- 書き込みはサーバー(service_role)のみ。service_role は RLS をバイパスする。
-- 閲覧は Supabase コンソール(service_role)で行う。
alter table public.quotes enable row level security;

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
