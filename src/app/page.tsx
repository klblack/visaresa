/**
 * トップページ
 * 国名検索バーとよく見られる渡航先一覧を表示する。
 */

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CountryCard from "@/components/CountryCard";
import SearchBar from "@/components/SearchBar";
import DisclaimerModal from "@/components/DisclaimerModal";
import type { CountryWithVisaInfo } from "@/types/database";

export const metadata: Metadata = {
  title: "VISARESA - 日本パスポートのビザ情報",
};

async function getPopularCountries(): Promise<CountryWithVisaInfo[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("countries")
    .select(`*, visa_info!inner(*)`)
    .eq("is_popular", true)
    .eq("visa_info.is_active", true)
    .order("name_ja", { ascending: true });

  if (error) {
    console.error("人気国の取得エラー:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    visa_info: Array.isArray(row.visa_info) ? row.visa_info[0] ?? null : row.visa_info,
  })) as CountryWithVisaInfo[];
}

export default async function HomePage() {
  const popularCountries = await getPopularCountries();

  return (
    <>
      <DisclaimerModal />

      {/* ヒーローセクション */}
      <section className="py-14 text-center">
        <h1 className="mb-2 text-4xl font-black text-gray-900">
          日本パスポートで<br className="sm:hidden" />行ける国を調べる
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          ビザ要否・滞在日数・申請費用を一目で確認
        </p>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </section>

      {/* 人気の渡航先 */}
      <section className="mt-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
          人気の渡航先
        </h2>
        {popularCountries.length === 0 ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularCountries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
