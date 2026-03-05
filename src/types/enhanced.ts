/**
 * 拡張国別ビザ情報の型定義
 * 静的コンテンツ（詳細説明・FAQ・タイムラインなど）に使用する
 */

export interface EnhancedSource {
  title: string;
  url: string;
  category: "政府公式" | "外務省" | "大使館" | "その他";
}

export interface ConclusionItem {
  id: string;
  title: string;
  description: string;
  fee?: string;
  url?: string;
  badge?: string;     // 「要確認」など
  condition?: string; // 条件付きの場合の適用条件
}

export interface EnhancedDocument {
  id: string;
  title: string;
  description: string;
  officialUrl?: string;
  isRequired: boolean;
}

export interface TimelineStep {
  phase: string;      // 「渡航72時間以上前」など
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

export interface EnhancedConditions {
  nationality: string;
  purpose: string;
  maxStayDays: number;
}

export interface EnhancedCountryData {
  updatedAt: string;
  sources: EnhancedSource[];
  disclaimer: {
    summary: string;
    detail: string;
  };
  conditions: EnhancedConditions;
  conclusions: {
    required: ConclusionItem[];
    conditional: ConclusionItem[];
    notRequired: string[];
  };
  documents: EnhancedDocument[];
  checklist: string[];
  timeline: TimelineStep[];
  faqs: FAQ[];
  changeLog: ChangeLogEntry[];
}
