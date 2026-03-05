/**
 * ルートレイアウト
 * 全ページ共通のレイアウト・メタデータ・フォント設定を定義する。
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter フォントを最適化して読み込む
// variable として CSS 変数に設定し Tailwind から使えるようにする
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// SEO と SNS シェア用のメタデータ
export const metadata: Metadata = {
  title: {
    default: "VISARESA - 日本パスポートのビザ情報",
    template: "%s | VISARESA",
  },
  description:
    "日本人旅行者向けのビザ情報サービス。日本パスポートで各国に入国する際のビザ要否・必要書類・申請方法をわかりやすく提供します。",
  keywords: ["ビザ", "ビザ情報", "日本人旅行", "海外旅行", "パスポート", "入国"],
  openGraph: {
    siteName: "VISARESA",
    locale: "ja_JP",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="min-h-screen">
        {/* グローバルヘッダー */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-blue-600">
                VISARESA
              </span>
              <span className="hidden text-xs text-gray-400 sm:block">
                日本パスポートのビザ情報
              </span>
            </a>
            <nav className="flex items-center gap-4">
              <a href="/check" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                渡航判定
              </a>
              <a href="/sources" className="text-sm text-gray-500 hover:text-gray-900">
                情報ソース
              </a>
            </nav>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        {/* グローバルフッター */}
        <footer className="mt-16 border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-gray-400">
            <p>
              VISARESA は参考情報サービスです。渡航前に必ず公式情報をご確認ください。
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} VISARESA. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
