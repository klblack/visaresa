-- ============================================================
-- VISARESA シードデータ
-- 東南アジア主要5カ国の初期データ
-- ビザ情報は 2024年12月時点の情報に基づく（定期更新必須）
-- ============================================================

-- ============================================================
-- 国データの挿入
-- ============================================================
insert into countries (iso_code, name_ja, name_en, region, flag_emoji, is_popular)
values
  ('TH', 'タイ',         'Thailand',    '東南アジア', '🇹🇭', true),
  ('VN', 'ベトナム',     'Vietnam',     '東南アジア', '🇻🇳', true),
  ('ID', 'インドネシア', 'Indonesia',   '東南アジア', '🇮🇩', true),
  ('PH', 'フィリピン',   'Philippines', '東南アジア', '🇵🇭', true),
  ('MY', 'マレーシア',   'Malaysia',    '東南アジア', '🇲🇾', true)
on conflict (iso_code) do update set
  name_ja    = excluded.name_ja,
  name_en    = excluded.name_en,
  region     = excluded.region,
  flag_emoji = excluded.flag_emoji,
  is_popular = excluded.is_popular,
  updated_at = now();

-- ============================================================
-- ビザ情報の挿入
-- WITH 句を使って country_id を name で取得する
-- ※ 情報は外務省・各国大使館の公式情報に基づく
--   必ず最新情報を確認し、定期的に更新すること
-- ============================================================

-- タイ：ビザ免除（30日→60日に延長済み、2024年時点）
with th as (select id from countries where iso_code = 'TH')
insert into visa_info (
  country_id, visa_type, max_stay_days, fee_usd,
  required_docs, official_url, notes, source_url, verified_at
)
select
  th.id,
  'visa_free',
  60,
  null, -- 無料
  array[
    'パスポート（有効期限6ヶ月以上）',
    '帰国便の航空券',
    '滞在先の住所（ホテル予約確認書など）',
    '滞在費の証明（現金または残高証明）'
  ],
  'https://www.thaiembassy.jp/',
  '2024年からビザ免除期間が30日→60日に延長。観光目的のみ。就労・長期滞在は別途手続き必要。',
  'https://www.mofa.go.jp/mofaj/toko/visa/tanki/thailand.html',
  '2024-12-01'
from th;

-- ベトナム：ビザ免除（45日、2023年8月から延長）
with vn as (select id from countries where iso_code = 'VN')
insert into visa_info (
  country_id, visa_type, max_stay_days, fee_usd,
  required_docs, official_url, notes, source_url, verified_at
)
select
  vn.id,
  'visa_free',
  45,
  null, -- 無料
  array[
    'パスポート（有効期限6ヶ月以上）',
    '往復航空券',
    '滞在先住所'
  ],
  'https://evisa.xuatnhapcanh.gov.vn/',
  '2023年8月より日本人のビザ免除期間が15日→45日に延長。90日以上滞在する場合はeVisaまたは大使館申請が必要。',
  'https://www.vn.emb-japan.go.jp/itprtop_ja/index.html',
  '2024-12-01'
from vn;

-- インドネシア：ビザ免除（バリ島を含む観光目的、30日）
with id_country as (select id from countries where iso_code = 'ID')
insert into visa_info (
  country_id, visa_type, max_stay_days, fee_usd,
  required_docs, official_url, notes, source_url, verified_at
)
select
  id_country.id,
  'visa_free',
  30,
  null, -- 無料
  array[
    'パスポート（有効期限6ヶ月以上）',
    '往復航空券',
    '滞在費の証明（1日あたり最低1,000,000ルピア相当）',
    '滞在先住所'
  ],
  'https://evisa.imigrasi.go.id/',
  '観光目的のみビザ免除。30日延長可能（合計60日）。ビジネス・就労目的は別途申請必要。ソーシャルビザで長期滞在も可能。',
  'https://www.mofa.go.jp/mofaj/toko/visa/tanki/indonesia.html',
  '2024-12-01'
from id_country;

-- フィリピン：ビザ免除（最大30日、空港で延長手続き可）
with ph as (select id from countries where iso_code = 'PH')
insert into visa_info (
  country_id, visa_type, max_stay_days, fee_usd,
  required_docs, official_url, notes, source_url, verified_at
)
select
  ph.id,
  'visa_free',
  30,
  null, -- 無料
  array[
    'パスポート（有効期限6ヶ月以上）',
    '往復航空券',
    '滞在先住所',
    '旅行保険（推奨）'
  ],
  'https://visa.gov.ph/',
  '初回入国時は最大30日間のビザ免除。到着後にBIAL（フィリピン入国管理局）で延長可能（最大59日、その後も延長可）。',
  'https://www.mofa.go.jp/mofaj/toko/visa/tanki/philippines.html',
  '2024-12-01'
from ph;

-- マレーシア：ビザ免除（最大90日）
with my as (select id from countries where iso_code = 'MY')
insert into visa_info (
  country_id, visa_type, max_stay_days, fee_usd,
  required_docs, official_url, notes, source_url, verified_at
)
select
  my.id,
  'visa_free',
  90,
  null, -- 無料
  array[
    'パスポート（有効期限6ヶ月以上）',
    '往復航空券',
    '滞在費の証明',
    '滞在先住所'
  ],
  'https://www.imi.gov.my/',
  '観光・商用目的で最大90日間ビザ免除。東南アジアで最も長い免除期間の一つ。就労目的は就労ビザが必要。',
  'https://www.mofa.go.jp/mofaj/toko/visa/tanki/malaysia.html',
  '2024-12-01'
from my;
