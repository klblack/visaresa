/**
 * robots.txt の動的生成
 * /result はクロール対象外（noindex + disallow）
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visaresa.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/result", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
