/**
 * Supabase クライアント（ブラウザ用）
 * Client Components から使用する。
 * シングルトンパターンで複数のインスタンス生成を防ぐ。
 */

import { createBrowserClient } from "@supabase/ssr";

// ブラウザ環境での Supabase クライアントを生成する関数
// createBrowserClient は内部でシングルトンを管理するため、
// 毎回呼んでも同一インスタンスが返る
export function createClient() {
  return createBrowserClient(
    // 環境変数が未設定の場合は明示的なエラーを出す
    // Vercel や .env.local で必ず設定すること
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
