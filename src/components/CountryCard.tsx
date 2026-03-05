/**
 * 国カード（トップページ一覧用）
 * 国名・ビザ種別・最大滞在日数を表示するサマリーカード。
 * Server Component として実装（データはすでにプロップスで受け取る）。
 */

import Link from "next/link";
import type { CountryWithVisaInfo } from "@/types/database";
import { VISA_TYPE_LABELS } from "@/types/database";
import { formatStayDays } from "@/lib/utils";

interface CountryCardProps {
  country: CountryWithVisaInfo;
}

export default function CountryCard({ country }: CountryCardProps) {
  const visa = country.visa_info;

  // ビザ情報がない場合のフォールバック表示設定
  const visaLabel = visa
    ? VISA_TYPE_LABELS[visa.visa_type]
    : { label: "情報なし", color: "text-gray-500", bgColor: "bg-gray-100" };

  return (
    <Link
      href={`/countries/${country.iso_code.toLowerCase()}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-100
                 bg-white p-5 shadow-sm transition-all
                 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      {/* 国旗と国名 */}
      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">
          {country.flag_emoji ?? "🏳"}
        </span>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-700">
            {country.name_ja}
          </h3>
          <p className="text-xs text-gray-400">{country.name_en}</p>
        </div>
      </div>

      {/* ビザ種別バッジ */}
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold
                    ${visaLabel.bgColor} ${visaLabel.color}`}
      >
        {visaLabel.label}
      </span>

      {/* 最大滞在日数 */}
      {visa && (
        <p className="text-sm text-gray-600">
          <span className="font-medium">{formatStayDays(visa.max_stay_days)}</span>
        </p>
      )}

      {/* 地域タグ */}
      <p className="text-xs text-gray-400">{country.region}</p>
    </Link>
  );
}
