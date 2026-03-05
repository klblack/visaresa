/**
 * 免責事項（詳細版）
 * ページ末尾に表示する。上部の短文バナーと対になる詳細説明。
 */

interface DisclaimerProps {
  detail: string;
}

export default function Disclaimer({ detail }: DisclaimerProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <span aria-hidden="true">⚠️</span>
        <span className="text-xs font-semibold text-gray-500">免責事項</span>
      </div>
      <p className="text-xs leading-relaxed text-gray-400">{detail}</p>
    </div>
  );
}
