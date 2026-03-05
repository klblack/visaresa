/**
 * 判定結果ページ
 * /result?country=US&nationality=JP&purpose=tourism&days=90
 * 拡張データがある国 → ResultLayout 表示
 * 拡張データがない国 → /countries/[code] にリダイレクト
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResultLayout from "@/components/result/ResultLayout";
import type { Country } from "@/types/database";
import type { CountryVisaData, VisaConditions } from "@/types/enhanced";
import { usData } from "@/data/us";

// 拡張データが存在する国のマップ
const ENHANCED_DATA: Record<string, CountryVisaData> = {
  US: usData,
};

interface PageProps {
  searchParams: {
    country?: string;
    nationality?: string;
    purpose?: string;
    days?: string;
    via?: string;
  };
}

async function getCountry(isoCode: string): Promise<Country | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("iso_code", isoCode.toUpperCase())
    .single();
  if (error || !data) return null;
  return data as Country;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const code = searchParams.country?.toUpperCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visaresa.com";
  const country = code ? await getCountry(code) : null;
  const canonical = code ? `${siteUrl}/countries/${code.toLowerCase()}` : `${siteUrl}/check`;

  return {
    title: country ? `${country.name_ja}への渡航判定結果` : "渡航判定結果",
    robots: { index: false, follow: false },
    alternates: { canonical },
  };
}

export default async function ResultPage({ searchParams }: PageProps) {
  const code = searchParams.country?.toUpperCase();
  if (!code) redirect("/check");

  const country = await getCountry(code);
  if (!country) notFound();

  const enhancedData = ENHANCED_DATA[code];

  // 拡張データがない国はシンプルな国別ページに飛ばす
  if (!enhancedData) {
    redirect(`/countries/${code.toLowerCase()}`);
  }

  const conditions: VisaConditions = {
    country: code,
    nationality: (searchParams.nationality ?? "JP") as "JP",
    purpose: (searchParams.purpose === "business" ? "business" : "tourism"),
    days: (["30", "90", "91plus"].includes(searchParams.days ?? "")
      ? (searchParams.days as "30" | "90" | "91plus")
      : "90"),
    via: searchParams.via,
  };

  return (
    <ResultLayout country={country} data={enhancedData} conditions={conditions} />
  );
}
