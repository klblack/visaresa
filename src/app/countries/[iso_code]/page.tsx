/**
 * 国別ビザ情報詳細ページ
 * /countries/[iso_code] でアクセスする（例: /countries/us）
 * 拡張データが存在する国は EnhancedCountryLayout を使用する。
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import VisaInfoCard from "@/components/VisaInfoCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import EnhancedCountryLayout from "@/components/country/EnhancedCountryLayout";
import EntrySummary from "@/components/country/EntrySummary";
import type { CountryWithVisaInfo } from "@/types/database";
import type { CountryVisaData } from "@/types/enhanced";
import { usData } from "@/data/us";

interface PageProps {
  params: { iso_code: string };
}

// 拡張データが存在する国のマップ
// 将来的に他の国が増えたらここに追加する
const ENHANCED_DATA: Record<string, CountryVisaData> = {
  US: usData,
};

async function getCountryWithVisaInfo(
  isoCode: string
): Promise<CountryWithVisaInfo | null> {
  const supabase = createClient();
  const upperCode = isoCode.toUpperCase();

  const { data, error } = await supabase
    .from("countries")
    .select(`*, visa_info(*)`)
    .eq("iso_code", upperCode)
    .eq("visa_info.is_active", true)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    visa_info: Array.isArray(data.visa_info)
      ? data.visa_info[0] ?? null
      : data.visa_info,
  } as CountryWithVisaInfo;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = await getCountryWithVisaInfo(params.iso_code);
  if (!country) return { title: "国が見つかりません" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visaresa.com";
  const canonical = `${siteUrl}/countries/${params.iso_code.toLowerCase()}`;
  const title = `${country.name_ja}のビザ情報 | 日本パスポート`;
  const description = `日本パスポートで${country.name_ja}に渡航する際のビザ要否・最大滞在日数・必要書類・申請方法を確認。`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "VISARESA",
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const country = await getCountryWithVisaInfo(params.iso_code);
  if (!country) notFound();

  // 拡張データが存在する国は拡張レイアウトで表示
  const enhancedData = ENHANCED_DATA[params.iso_code.toUpperCase()];
  if (enhancedData) {
    return <EnhancedCountryLayout country={country} data={enhancedData} />;
  }

  // 拡張データがない国は基本レイアウト
  const visa = country.visa_info;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
        >
          <ArrowLeft size={15} />
          ホーム
        </Link>
      </div>

      <div className="mb-5 flex items-center gap-4">
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

      {/* 2段結論カード（国名直下） */}
      {visa && <EntrySummary visa={visa} />}

      <div className="mb-6">
        <DisclaimerBanner />
      </div>

      {visa ? (
        <VisaInfoCard visaInfo={visa} />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <Globe size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-500">
            {country.name_ja}のビザ情報は現在準備中です
          </p>
          <a
            href="https://www.mofa.go.jp/mofaj/toko/visa/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
          >
            外務省 海外渡航情報
          </a>
        </div>
      )}
    </div>
  );
}
