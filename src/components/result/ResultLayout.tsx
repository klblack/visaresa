/**
 * 判定結果レイアウト
 * /result ページで判定結果を表示するオーケストレーター。
 * 2段階結論（A+B）+ 渡航先詳細ページへのリンク。
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Country } from "@/types/database";
import type { CountryVisaData, VisaConditions } from "@/types/enhanced";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import ConditionsBar from "@/components/country/ConditionsBar";
import TwoStageSummary from "./TwoStageSummary";
import { formatDateJa } from "@/lib/utils";

interface Props {
  country: Country;
  data: CountryVisaData;
  conditions: VisaConditions;
}

const PURPOSE_LABEL: Record<string, string> = {
  tourism: "観光・短期滞在",
  business: "商用・出張",
};

const DAYS_LABEL: Record<string, string> = {
  "30": "30日以内",
  "90": "31〜90日",
  "91plus": "91日以上",
};

export default function ResultLayout({ country, data, conditions }: Props) {
  const purposeLabel = PURPOSE_LABEL[conditions.purpose] ?? conditions.purpose;
  const stayLabel = DAYS_LABEL[conditions.days] ?? conditions.days;

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* ヘッダー */}
      <div className="mb-5 flex items-center gap-4">
        <span className="text-5xl" aria-hidden="true">
          {country.flag_emoji ?? "🏳"}
        </span>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{country.name_ja}</h1>
          <p className="text-sm text-gray-400">
            {country.name_en} · 確認日: {formatDateJa(data.updatedAt)}
          </p>
        </div>
      </div>

      {/* 免責（短文）*/}
      <div className="mb-4">
        <DisclaimerBanner />
      </div>

      {/* 条件バー（Sticky）*/}
      <ConditionsBar
        purpose={purposeLabel}
        stayLabel={stayLabel}
        via={conditions.via}
      />

      {/* 2段階結論 */}
      <div className="mt-6">
        <TwoStageSummary data={data} />
      </div>

      {/* 詳細ページリンク */}
      <div className="mt-8">
        <Link
          href={`/countries/${country.iso_code.toLowerCase()}`}
          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
        >
          <div>
            <p className="font-semibold text-gray-900">
              {country.name_ja} の詳細情報を見る
            </p>
            <p className="text-sm text-gray-400">
              必要書類・手続きの流れ・FAQ・更新履歴
            </p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
