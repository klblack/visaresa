/**
 * Supabase データベースの型定義
 * supabase gen types typescript コマンドで自動生成するのが理想だが、
 * 初期開発では手動で定義する
 */

// ビザ種別の型（DB の check constraint と一致させる）
export type VisaType = "visa_free" | "visa_on_arrival" | "e_visa" | "embassy";

// ユーザー報告の種別
export type ReportType = "correction" | "experience" | "update";

// ユーザー報告のモデレーション状態
export type ReportStatus = "pending" | "approved" | "rejected";

// countries テーブルの型
export interface Country {
  id: string;
  iso_code: string;
  name_ja: string;
  name_en: string;
  region: string;
  flag_emoji: string | null;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

// visa_info テーブルの型
export interface VisaInfo {
  id: string;
  country_id: string;
  visa_type: VisaType;
  max_stay_days: number | null;
  fee_usd: number | null;
  required_docs: string[] | null;
  official_url: string | null;
  notes: string | null;
  source_url: string;
  verified_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// user_reports テーブルの型
export interface UserReport {
  id: string;
  country_id: string;
  report_type: ReportType;
  content: string;
  travel_date: string | null;
  source_url: string | null;
  status: ReportStatus;
  user_id: string | null;
  created_at: string;
}

// consent_logs テーブルの型
export interface ConsentLog {
  id: string;
  session_id: string;
  user_id: string | null;
  version: string;
  ip_address: string | null;
  user_agent: string | null;
  consented_at: string;
}

// JOIN クエリ用の複合型
// 国ページ表示に使う（country + visa_info を結合した結果）
export interface CountryWithVisaInfo extends Country {
  visa_info: VisaInfo | null;
}

// ビザ種別の日本語ラベル・カラー対応
export const VISA_TYPE_LABELS: Record<
  VisaType,
  { label: string; color: string; bgColor: string }
> = {
  visa_free: {
    label: "ビザ不要",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  visa_on_arrival: {
    label: "アライバルビザ",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  e_visa: {
    label: "電子ビザ（eVisa）",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  embassy: {
    label: "大使館申請",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
};
