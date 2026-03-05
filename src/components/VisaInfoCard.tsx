/**
 * ビザ情報詳細カード
 * 国別詳細ページで使用する。ビザ種別・滞在日数・費用・必要書類などを表示する。
 */

import { ExternalLink, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { VisaInfo } from "@/types/database";
import { VISA_TYPE_LABELS } from "@/types/database";
import { formatFeeUsd, formatStayDays, formatDateJa } from "@/lib/utils";

interface VisaInfoCardProps {
  visaInfo: VisaInfo;
}

export default function VisaInfoCard({ visaInfo }: VisaInfoCardProps) {
  const typeLabel = VISA_TYPE_LABELS[visaInfo.visa_type];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* ヘッダー：ビザ種別 */}
      <div className={`px-6 py-4 ${typeLabel.bgColor}`}>
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-bold ${typeLabel.color}`}>
            {visaInfo.visa_type === "visa_free" ? "✓" : "●"}
          </span>
          <div>
            <p className="text-sm font-medium text-gray-600">ビザ種別</p>
            <p className={`text-xl font-bold ${typeLabel.color}`}>
              {typeLabel.label}
            </p>
          </div>
        </div>
      </div>

      {/* 詳細情報グリッド */}
      <div className="grid grid-cols-2 gap-px bg-gray-100">
        {/* 最大滞在日数 */}
        <InfoCell
          icon={<Clock size={16} className="text-blue-500" />}
          label="最大滞在日数"
          value={formatStayDays(visaInfo.max_stay_days)}
        />
        {/* 申請費用 */}
        <InfoCell
          icon={<CheckCircle size={16} className="text-green-500" />}
          label="申請費用"
          value={formatFeeUsd(visaInfo.fee_usd)}
        />
      </div>

      {/* 必要書類 */}
      {visaInfo.required_docs && visaInfo.required_docs.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            <CheckCircle size={16} className="text-blue-500" />
            必要書類
          </h3>
          <ul className="space-y-2">
            {visaInfo.required_docs.map((doc, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 備考・注意事項 */}
      {visaInfo.notes && (
        <div className="border-t px-6 py-4">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
            <AlertCircle size={16} className="text-amber-500" />
            注意事項
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">{visaInfo.notes}</p>
        </div>
      )}

      {/* 公式申請リンク */}
      {visaInfo.official_url && (
        <div className="border-t px-6 py-4">
          <a
            href={visaInfo.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ExternalLink size={16} />
            公式申請ページ
          </a>
        </div>
      )}

      {/* 出典情報と最終確認日 */}
      <div className="border-t bg-gray-50 px-6 py-3 text-xs text-gray-400">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>最終確認日: {formatDateJa(visaInfo.verified_at)}</span>
          <a
            href={visaInfo.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-600"
          >
            <ExternalLink size={12} />
            出典
          </a>
        </div>
      </div>
    </div>
  );
}

// 情報セルの補助コンポーネント
function InfoCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white px-6 py-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}
