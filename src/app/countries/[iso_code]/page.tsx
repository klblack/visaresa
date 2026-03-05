/**
 * 国別ビザ情報詳細ページ
 * /countries/[iso_code] でアクセスする（例: /countries/th）
 * ISO コードは大文字小文字どちらでも対応する
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import VisaInfoCard from "@/components/VisaInfoCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import type { CountryWithVisaInfo } from "@/types/database";

interface PageProps {
  params: { iso_code: string };
}

/**
 * ISO コードから国とビザ情報を取得する
 * ISO コードは大文字に正規化して検索する
 */
async function getCountryWithVisaInfo(
  isoCode: string
): Promise<CountryWithVisaInfo | null> {
  const supabase = createClient();
  const upperCode = isoCode.toUpperCase();

  const { data, error } = await supabase
    .from("countries")
    .select(
      `
      *,
      visa_info(*)
      `
    )
    .eq("iso_code", upperCode)
    .eq("visa_info.is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  // visa_info は配列で返るため最初の要素を取り出す
  return {
    ...data,
    visa_info: Array.isArray(data.visa_info)
      ? data.visa_info[0] ?? null
      : data.visa_info,
  } as CountryWithVisaInfo;
}

/**
 * 動的メタデータの生成
 * 国名を SEO タイトルに含める
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = await getCountryWithVisaInfo(params.iso_code);
  if (!country) return { title: "国が見つかりません | VISARESA" };

  return {
    title: `${country.name_ja}のビザ情報`,
    description: `日本パスポートで${country.name_ja}に渡航する際のビザ要否・必要書類・申請方法を確認できます。`,
  };
}

export default async function CountryPage({ params }: PageProps) {
  const country = await getCountryWithVisaInfo(params.iso_code);

  // 国が見つからない場合は 404 ページを表示
  if (!country) {
    notFound();
  }

  const visa = country.visa_info;

  return (
    <div className="max-w-2xl">
      {/* パンくずリスト */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          ホームに戻る
        </Link>
      </div>

      {/* 国名ヘッダー */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-6xl" aria-hidden="true">
          {country.flag_emoji ?? "🏳"}
        </span>
        <div>
          <h1 className="text-3xl font-black text-gray-900">{country.name_ja}</h1>
          <p className="text-gray-400">
            {country.name_en} &middot; {country.region}
          </p>
        </div>
      </div>

      {/* 免責事項バナー（常時表示） */}
      <div className="mb-6">
        <DisclaimerBanner />
      </div>

      {/* ビザ情報カード */}
      {visa ? (
        <VisaInfoCard visaInfo={visa} />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
          <Globe size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-500">
            {country.name_ja}のビザ情報は現在準備中です
          </p>
          <p className="mt-1 text-sm text-gray-400">
            外務省の公式サイトで最新情報をご確認ください
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

      {/* ユーザー投稿セクション */}
      <div className="mt-8 rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Users size={18} className="text-blue-500" />
          <h2 className="font-semibold text-blue-900">旅行者からの報告</h2>
        </div>
        <p className="text-sm text-blue-700">
          {country.name_ja}への渡航経験がある方、最新情報や誤りを発見した方はぜひ報告をお寄せください。
        </p>
        {/* TODO: フェーズ2でユーザー投稿フォームを実装 */}
        <p className="mt-2 text-xs text-blue-400">
          ※ ユーザー投稿機能は近日公開予定です
        </p>
      </div>

      {/* 関連リンク */}
      <div className="mt-8">
        <h2 className="mb-3 font-semibold text-gray-800">公式情報リンク</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://www.mofa.go.jp/mofaj/toko/visa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              外務省 – 海外渡航のビザ情報
            </a>
          </li>
          <li>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                `${country.name_en} embassy Japan visa`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {country.name_ja}大使館（在日）公式サイトを検索
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
