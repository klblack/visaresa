/**
 * トップページ
 * 国名検索バーとよく見られる渡航先一覧を表示する。
 * Server Component として Supabase からデータを取得し、
 * クライアント側の処理は子コンポーネントに委譲する。
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

/**
 * 人気の渡航先データを取得する
 * countries と visa_info を JOIN して一括取得する
 * is_popular = true の国のみ取得（トップページ表示用）
 */
async function getPopularCountries(): Promise<CountryWithVisaInfo[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("countries")
    .select(
      `
      *,
      visa_info!inner(*)
      `
    )
    .eq("is_popular", true)
    .eq("visa_info.is_active", true)
    .order("name_ja", { ascending: true });

  if (error) {
    // エラーログはサーバーサイドのみ（クライアントに詳細を漏らさない）
    console.error("人気国の取得エラー:", error);
    return [];
  }

  // Supabase の JOIN 結果は配列で返るため、最初の要素を取り出す
  return (data ?? []).map((row) => ({
    ...row,
    visa_info: Array.isArray(row.visa_info) ? row.visa_info[0] ?? null : row.visa_info,
  })) as CountryWithVisaInfo[];
}

// ページコンポーネントは async Server Component
export default async function HomePage() {
  const popularCountries = await getPopularCountries();

  return (
    <>
      {/* 免責事項モーダル（Client Component、初回のみ表示） */}
      {/* プロップなしで直接レンダリング：モーダルが localStorage を独立管理する */}
      <DisclaimerModal />

      {/* ヒーローセクション */}
      <section className="py-12 text-center">
        <h1 className="mb-3 text-4xl font-black text-gray-900">
          <span className="text-blue-600">日本パスポート</span>で行ける国を調べる
        </h1>
        <p className="mb-8 text-lg text-gray-500">
          ビザ要否・必要書類・申請方法をすぐに確認できます
        </p>

        {/* 検索バー */}
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </section>

      {/* よく見られる渡航先 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          よく見られる渡航先
        </h2>
        {popularCountries.length === 0 ? (
          <p className="text-gray-500">渡航先データを読み込み中...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularCountries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </section>

      {/* サービス説明 */}
      <section className="mt-16 rounded-2xl bg-blue-50 p-6">
        <h2 className="mb-2 font-bold text-blue-900">VISARESAについて</h2>
        <p className="text-sm leading-relaxed text-blue-800">
          VISARESAは日本人旅行者が海外渡航に必要なビザ情報を素早く確認できるサービスです。
          AI自動収集とユーザー投稿のハイブリッド方式で情報を更新しています。
          ただし情報は参考目的のみであり、渡航前には必ず各国大使館や外務省の公式情報をご確認ください。
        </p>
      </section>
    </>
  );
}

