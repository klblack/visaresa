/**
 * 動的サイトマップ
 * /sitemap.xml を自動生成する。
 * 国別ページは Supabase の countries テーブルから取得。
 */

import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visaresa.com";
  const now = new Date();

  // countries テーブルから全国を取得
  const supabase = createClient();
  const { data: countries } = await supabase
    .from("countries")
    .select("iso_code, updated_at");

  const countryUrls: MetadataRoute.Sitemap = (countries ?? []).map((c) => ({
    url: `${siteUrl}/countries/${c.iso_code.toLowerCase()}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/check`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/sources`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...countryUrls,
  ];
}
