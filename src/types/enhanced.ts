/**
 * 国別ビザ情報の型定義（2段結論構造）
 * A) preDeparture: 出国前に必要（パスポート以外）
 * B) entryConditions: 入国成立条件
 */

export interface EnhancedSource {
  title: string;
  url: string;
  category: "政府公式" | "外務省" | "大使館" | "その他";
}

/** 出国前に必要な要件（必須/条件付き/推奨） */
export interface RequirementItem {
  id: string;
  title: string;
  description: string;
  fee?: string;
  url?: string;
  badge?: string;     // 「要確認」など
  condition?: string; // 条件付きの場合の適用条件
}

/** 入国成立条件（必須/裁量） */
export interface EntryCondition {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export interface EnhancedDocument {
  id: string;
  title: string;
  description: string;
  officialUrl?: string;
  isRequired: boolean;
}

export interface TimelineStep {
  phase: string;
  title: string;
  description: string;
  isRequired: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ChangeLogEntry {
  date: string;
  note: string;
}

/** 国別ビザデータの主要型 */
export interface CountryVisaData {
  updatedAt: string;
  sources: EnhancedSource[];
  disclaimer: { summary: string; detail: string };
  /** A) 出国前に必要（パスポート以外） */
  preDeparture: {
    required: RequirementItem[];     // 必須
    conditional: RequirementItem[];  // 条件付き
    recommended: RequirementItem[];  // 推奨
  };
  /** B) 入国成立条件 */
  entryConditions: {
    required: EntryCondition[];      // 必須条件
    discretionary: EntryCondition[]; // 裁量（確認されやすい）
  };
  documents: EnhancedDocument[];
  checklist: string[];
  timeline: TimelineStep[];
  faqs: FAQ[];
  changeLog: ChangeLogEntry[];
}

/** /check → /result に渡す判定条件（URLクエリパラメータ対応） */
export interface VisaConditions {
  country: string;      // ISO code
  nationality: string;  // "JP" etc.
  purpose: "tourism" | "business";
  days: "30" | "90" | "91plus";
  via?: string;
  departureDate?: string;
}

// === 後方互換型（既存コンポーネントが参照するため保持） ===

/** @deprecated RequirementItem を使用してください */
export type ConclusionItem = RequirementItem;

/** @deprecated CountryVisaData を使用してください */
export interface EnhancedCountryData extends CountryVisaData {
  conditions: { nationality: string; purpose: string; maxStayDays: number };
  conclusions: {
    required: ConclusionItem[];
    conditional: ConclusionItem[];
    notRequired: string[];
  };
}

/** @deprecated CountryVisaData に統合されました */
export type EnhancedConditions = EnhancedCountryData["conditions"];
