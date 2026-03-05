/**
 * ユーティリティ関数集
 * shadcn/ui のクラス結合ヘルパーと日付フォーマット関数を提供する
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS クラスを安全に結合する
 * shadcn/ui コンポーネントでの標準パターン
 * clsx で条件分岐を処理し、twMerge で重複クラスを解決する
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ISO 日付文字列を日本語表記にフォーマットする
 * 例: "2024-12-01" → "2024年12月1日"
 */
export function formatDateJa(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 費用を表示用文字列に変換する
 * null の場合は「無料」を返す
 */
export function formatFeeUsd(feeUsd: number | null): string {
  if (feeUsd === null) return "無料";
  return `約 USD ${feeUsd.toFixed(0)}`;
}

/**
 * 滞在日数を表示用文字列に変換する
 * null の場合は「要確認」を返す
 */
export function formatStayDays(days: number | null): string {
  if (days === null) return "要確認";
  return `最大 ${days} 日間`;
}

/**
 * 当然の必要書類（往復航空券・滞在先住所・滞在費証明・パスポート単体）を除外する
 * DB のデータは変えず、表示時にフィルタリングする方針
 */
export function filterObviousDocs(docs: string[]): string[] {
  return docs.filter((doc) => {
    // 往復航空券・帰国便の航空券は除外
    if (/航空券/.test(doc)) return false;
    // 滞在先住所（ホテル予約確認書含む）は除外
    if (/滞在先住所/.test(doc)) return false;
    // 滞在費の証明（残高証明含む）は除外
    if (/滞在費の証明/.test(doc)) return false;
    // パスポート：有効期限・ICチップ・空白ページの具体的条件がない場合は除外
    if (/パスポート/.test(doc) && !/有効期限|ICチップ|空白ページ/.test(doc)) return false;
    return true;
  });
}

/**
 * セッション ID を生成する
 * 免責事項の同意記録に使用する
 * crypto.randomUUID が使えない環境への fallback も含む
 */
export function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback: タイムスタンプ + ランダム文字列
  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
