/**
 * 免責事項バナー（常時表示）
 * 国別詳細ページの上部に表示する警告バナー。
 * モーダルの同意とは別に、常にユーザーに注意を促す。
 */

import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-amber-200
                 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
      <p>
        <strong>ご注意：</strong>
        ビザ情報は変更される場合があります。渡航前に必ず
        <a
          href="https://www.mofa.go.jp/mofaj/toko/visa/"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 font-semibold underline decoration-dotted"
        >
          外務省の海外安全情報
        </a>
        および渡航先の在日大使館公式サイトで最新情報を確認してください。
      </p>
    </div>
  );
}
