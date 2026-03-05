/**
 * Supabase クライアント（サーバー用）
 * Server Components・Route Handlers・Server Actions から使用する。
 * Next.js の cookies() を使ってセッションを管理する。
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// サーバー環境での Supabase クライアントを生成する関数
// cookies() は Server Component 内でのみ使用可能
// App Router では毎リクエストごとに新しいインスタンスを生成する設計
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // リクエストのクッキーを読み取る
        getAll() {
          return cookieStore.getAll();
        },
        // レスポンスにクッキーをセットする
        // Server Component では書き込み不可のため try/catch で囲む
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component 内では set が失敗することがある
            // ミドルウェアでセッション更新を行う場合は無視して良い
          }
        },
      },
    }
  );
}
