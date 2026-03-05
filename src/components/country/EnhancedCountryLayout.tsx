/**
 * 拡張国別ページレイアウト
 * 2段階結論（A: 出国前必要 / B: 入国成立条件）+ 詳細セクション群
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Country } from "@/types/database";
import type { CountryVisaData } from "@/types/enhanced";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import ConditionsBar from "./ConditionsBar";
import TwoStageSummary from "@/components/result/TwoStageSummary";
import Checklist from "./Checklist";
import DocumentCards from "./DocumentCards";
import Timeline from "./Timeline";
import FAQAccordion from "./FAQAccordion";
import SourcesPanel from "./SourcesPanel";
import ChangeLog from "./ChangeLog";
import Disclaimer from "./Disclaimer";
import { formatDateJa } from "@/lib/utils";

interface Props {
  country: Country;
  data: CountryVisaData;
  /** /check からのパラメータ（あれば ConditionsBar に反映） */
  purpose?: string;
  stayLabel?: string;
  via?: string;
}

const CATEGORY_BADGE: Record<string, string> = {
  政府公式: "bg-blue-100 text-blue-700",
  外務省:   "bg-purple-100 text-purple-700",
  大使館:   "bg-emerald-100 text-emerald-700",
};

export default function EnhancedCountryLayout({
  country,
  data,
  purpose = "観光・商用",
  stayLabel = "90日以内",
  via,
}: Props) {
  const uniqueCategories = data.sources
    .map((s) => s.category)
    .filter((cat, i, arr) => arr.indexOf(cat) === i);

  return (
    <div className="max-w-2xl">
      {/* 戻るリンク */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
        >
          <ArrowLeft size={15} />
          ホーム
        </Link>
      </div>

      {/* ページヘッダー：国旗+国名 / 確認日 / 出典カテゴリバッジ */}
      <div className="mb-5">
        <div className="mb-3 flex items-center gap-4">
          <span className="text-6xl" aria-hidden="true">
            {country.flag_emoji ?? "🏳"}
          </span>
          <div>
            <h1 className="text-3xl font-black text-gray-900">{country.name_ja}</h1>
            <p className="text-sm text-gray-400">
              {country.name_en} · {country.region}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">
            確認日: {formatDateJa(data.updatedAt)}
          </span>
          <span className="text-gray-200">·</span>
          {uniqueCategories.map((cat) => (
            <span
              key={cat}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                CATEGORY_BADGE[cat] ?? "bg-gray-100 text-gray-500"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* 免責（短文）*/}
      <div className="mb-4">
        <DisclaimerBanner />
      </div>

      {/* 条件バー（Sticky）*/}
      <ConditionsBar purpose={purpose} stayLabel={stayLabel} via={via} />

      {/* 各セクション */}
      <div className="mt-6 space-y-8">
        {/* 2段階結論 */}
        <Section label="入国要件">
          <TwoStageSummary data={data} />
        </Section>

        {/* チェックリスト */}
        <Checklist countryName={country.name_ja} items={data.checklist} />

        {/* 必要書類 */}
        <Section label="必要書類">
          <DocumentCards documents={data.documents} />
        </Section>

        {/* 手続きの流れ */}
        <Section label="手続きの流れ">
          <Timeline steps={data.timeline} />
        </Section>

        {/* FAQ */}
        <Section label="よくある質問">
          <FAQAccordion faqs={data.faqs} />
        </Section>

        {/* 出典 */}
        <SourcesPanel sources={data.sources} />

        {/* 更新履歴 */}
        <ChangeLog entries={data.changeLog} />

        {/* 免責（詳細）*/}
        <Disclaimer detail={data.disclaimer.detail} />
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </h2>
      {children}
    </div>
  );
}
