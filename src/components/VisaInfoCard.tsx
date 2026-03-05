/**
 * ビザ情報詳細カード
 * ビザ種別を大きなカラーヘッダーで、滞在日数・費用を大きな数字で表示する。
 * 必要書類はアコーディオン（デフォルト折りたたみ）。
 */

import { ExternalLink } from "lucide-react";
import type { VisaInfo } from "@/types/database";
import { VISA_TYPE_LABELS } from "@/types/database";
import { formatDateJa } from "@/lib/utils";
import DocumentRequirements from "./country/DocumentRequirements";

interface VisaInfoCardProps {
  visaInfo: VisaInfo;
}

export default function VisaInfoCard({ visaInfo }: VisaInfoCardProps) {
  const typeLabel = VISA_TYPE_LABELS[visaInfo.visa_type];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* ビザ種別ヘッダー（大きなカラーバッジ） */}
      <div className={`${typeLabel.bgColor} px-6 py-8 text-center`}>
        <span className={`text-3xl font-black tracking-wide ${typeLabel.color}`}>
          {typeLabel.label}
        </span>
      </div>

      {/* 滞在日数・費用（大きな数字） */}
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-6 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black text-gray-900">
              {visaInfo.max_stay_days ?? "?"}
            </span>
            <span className="text-lg text-gray-400">日</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">最大滞在日数</p>
        </div>
        <div className="p-6 text-center">
          {visaInfo.fee_usd === null ? (
            <>
              <span className="text-4xl font-black text-emerald-600">無料</span>
              <p className="mt-2 text-xs text-gray-400">申請費用</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-2xl font-bold text-gray-400">$</span>
                <span className="text-5xl font-black text-gray-900">
                  {visaInfo.fee_usd}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">申請費用（目安）</p>
            </>
          )}
        </div>
      </div>

      {/* 必要書類（3分類表示） */}
      {visaInfo.required_docs && visaInfo.required_docs.length > 0 && (
        <DocumentRequirements docs={visaInfo.required_docs} />
      )}

      {/* 注意事項 */}
      {visaInfo.notes && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <p className="text-sm leading-relaxed text-gray-500">{visaInfo.notes}</p>
        </div>
      )}

      {/* 公式申請ページへのリンク */}
      {visaInfo.official_url && (
        <div className="border-t border-gray-100 px-6 py-4">
          <a
            href={visaInfo.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900
                       px-4 py-3 text-sm font-semibold text-white
                       transition-colors hover:bg-gray-700"
          >
            <ExternalLink size={15} />
            公式申請ページ
          </a>
        </div>
      )}

      {/* 出典・確認日 */}
      <div className="border-t border-gray-100 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>確認日: {formatDateJa(visaInfo.verified_at)}</span>
          {visaInfo.source_url && (
            <a
              href={visaInfo.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-600"
            >
              <ExternalLink size={11} />
              出典
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
