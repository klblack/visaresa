/**
 * 免責事項バナー（常時表示・コンパクト1行バー）
 */

import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 rounded-lg border border-amber-100
                 bg-amber-50 px-3 py-2 text-xs text-amber-700"
    >
      <AlertTriangle size={13} className="shrink-0 text-amber-500" />
      <span>
        情報は参考目的のみです。渡航前に必ず
        <a
          href="https://www.mofa.go.jp/mofaj/toko/visa/"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 font-semibold underline decoration-dotted"
        >
          外務省公式サイト
        </a>
        で最新情報を確認してください。
      </span>
    </div>
  );
}
