/**
 * 国カード（トップページ一覧用）
 * ビザ種別を大きなカラーバッジで、滞在日数を大きな数字で表示する。
 */

import Link from "next/link";
import type { CountryWithVisaInfo } from "@/types/database";
import { VISA_TYPE_LABELS } from "@/types/database";

interface CountryCardProps {
  country: CountryWithVisaInfo;
}

export default function CountryCard({ country }: CountryCardProps) {
  const visa = country.visa_info;

  const visaLabel = visa
    ? VISA_TYPE_LABELS[visa.visa_type]
    : { label: "情報なし", color: "text-gray-500", bgColor: "bg-gray-200" };

  return (
    <Link
      href={`/countries/${country.iso_code.toLowerCase()}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100
                 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* 国旗と国名 */}
      <div className="flex items-center gap-3 p-5 pb-4">
        <span className="text-5xl" aria-hidden="true">
          {country.flag_emoji ?? "🏳"}
        </span>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-700">
            {country.name_ja}
          </h3>
          <p className="text-xs text-gray-400">{country.region}</p>
        </div>
      </div>

      {/* ビザ種別バッジ（カラー） */}
      <div className={`mx-5 mb-4 rounded-xl py-2 text-center ${visaLabel.bgColor}`}>
        <span className={`text-sm font-bold ${visaLabel.color}`}>
          {visaLabel.label}
        </span>
      </div>

      {/* 最大滞在日数（大きな数字） */}
      {visa && (
        <div className="flex items-baseline gap-1 px-5 pb-5">
          <span className="text-4xl font-black text-gray-900">
            {visa.max_stay_days ?? "?"}
          </span>
          <span className="text-sm text-gray-400">日</span>
        </div>
      )}
    </Link>
  );
}
