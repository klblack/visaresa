-- ============================================================
-- VISARESA データベーススキーマ
-- 日本人旅行者向けビザ情報サービスのテーブル定義
-- ============================================================

-- UUID 生成拡張を有効化（Supabase では通常デフォルトで有効）
create extension if not exists "uuid-ossp";

-- ============================================================
-- countries テーブル
-- 各国の基本情報を管理する
-- ============================================================
create table if not exists countries (
  id          uuid primary key default uuid_generate_v4(),
  iso_code    char(2) not null unique,   -- ISO 3166-1 alpha-2 コード（例: TH, VN）
  name_ja     text not null,             -- 国名（日本語）
  name_en     text not null,             -- 国名（英語）
  region      text not null,             -- 地域（例: 東南アジア, ヨーロッパ）
  flag_emoji  text,                      -- 国旗絵文字（例: 🇹🇭）
  is_popular  boolean not null default false, -- トップページに表示するかどうか
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- visa_info テーブル
-- 日本パスポートでの各国ビザ要件を管理する
-- ビザ情報は定期的に変わるため、確認日を必ず記録する
-- ============================================================
create table if not exists visa_info (
  id                 uuid primary key default uuid_generate_v4(),
  country_id         uuid not null references countries(id) on delete cascade,

  -- ビザ種別
  -- 'visa_free': ビザ不要, 'visa_on_arrival': アライバルビザ
  -- 'e_visa': 電子ビザ, 'embassy': 大使館申請必須
  visa_type          text not null check (visa_type in (
                       'visa_free', 'visa_on_arrival', 'e_visa', 'embassy'
                     )),

  max_stay_days      integer,            -- 最大滞在日数（nullは要確認）
  fee_usd            numeric(8, 2),      -- 申請費用（USD, nullは無料または要確認）
  required_docs      text[],            -- 必要書類リスト（配列で管理しやすくする）
  official_url       text,              -- 公式申請ページURL
  notes              text,              -- 備考・注意事項

  -- データ信頼性のために情報源と確認日を必須にする
  source_url         text not null,     -- 情報出典URL
  verified_at        date not null,     -- 情報確認日
  is_active          boolean not null default true, -- 最新情報かどうか

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- 1カ国につき有効なビザ情報は1件のみ（is_active=true）
-- 古い情報は is_active=false にして履歴として残す
create unique index if not exists visa_info_active_country_idx
  on visa_info(country_id)
  where is_active = true;

-- ============================================================
-- user_reports テーブル
-- ユーザーからのビザ情報投稿・訂正報告を管理する
-- AI収集だけでは追いつかないリアルタイム情報を補完する目的
-- ============================================================
create table if not exists user_reports (
  id           uuid primary key default uuid_generate_v4(),
  country_id   uuid not null references countries(id) on delete cascade,

  -- 投稿種別
  -- 'correction': 誤情報の訂正, 'experience': 実体験の共有
  -- 'update': 情報の更新報告
  report_type  text not null check (report_type in (
                 'correction', 'experience', 'update'
               )),

  content      text not null,           -- 投稿内容
  travel_date  date,                    -- 実際に渡航した日（オプション）
  source_url   text,                    -- 参照URL（オプション）

  -- モデレーション状態
  -- 'pending': 審査中, 'approved': 承認済み, 'rejected': 却下
  status       text not null default 'pending' check (status in (
                 'pending', 'approved', 'rejected'
               )),

  -- 匿名投稿を許可するため user_id は nullable
  user_id      uuid references auth.users(id) on delete set null,

  created_at   timestamptz not null default now()
);

-- ============================================================
-- consent_logs テーブル
-- 免責事項への同意記録を保管する
-- 法的証拠として同意時刻とIPアドレスを記録する
-- ============================================================
create table if not exists consent_logs (
  id           uuid primary key default uuid_generate_v4(),

  -- 匿名ユーザーも同意できるよう session_id で識別
  session_id   text not null,
  user_id      uuid references auth.users(id) on delete set null,

  -- 同意したバージョン（免責事項を改訂した場合に再同意を促すため）
  version      text not null default '1.0',
  ip_address   inet,                    -- IPアドレス（プライバシーポリシーに明記必須）
  user_agent   text,                    -- ブラウザ情報

  consented_at timestamptz not null default now()
);

-- ============================================================
-- updated_at を自動更新するトリガー関数
-- Supabase では RLS と合わせてよく使うパターン
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  -- レコード更新時に updated_at を現在時刻に更新する
  new.updated_at = now();
  return new;
end;
$$;

-- countries テーブルのトリガー
create trigger countries_updated_at
  before update on countries
  for each row execute function update_updated_at();

-- visa_info テーブルのトリガー
create trigger visa_info_updated_at
  before update on visa_info
  for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security (RLS) ポリシー設定
-- 読み取りは全員許可、書き込みは認証ユーザーまたはサービスロールのみ
-- ============================================================
alter table countries      enable row level security;
alter table visa_info      enable row level security;
alter table user_reports   enable row level security;
alter table consent_logs   enable row level security;

-- countries: 全員が読み取り可能
create policy "countries_public_read" on countries
  for select using (true);

-- visa_info: 全員が読み取り可能（有効なものだけ）
create policy "visa_info_public_read" on visa_info
  for select using (is_active = true);

-- user_reports: 承認済みのものだけ全員が読み取り可能
create policy "user_reports_public_read" on user_reports
  for select using (status = 'approved');

-- user_reports: 認証ユーザーまたは匿名ユーザーが投稿可能
create policy "user_reports_insert" on user_reports
  for insert with check (true);

-- consent_logs: 誰でも挿入可能（同意記録は全員が行う）
create policy "consent_logs_insert" on consent_logs
  for insert with check (true);

-- consent_logs: 自分のセッションの記録だけ読み取り可能
create policy "consent_logs_own_read" on consent_logs
  for select using (session_id = current_setting('app.session_id', true));
