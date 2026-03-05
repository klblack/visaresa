/**
 * 404 ページ
 * 存在しない国コードや URL にアクセスした場合に表示する
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-black text-gray-200">404</p>
      <h2 className="mt-4 text-xl font-bold text-gray-700">
        ページが見つかりません
      </h2>
      <p className="mt-2 text-gray-400">
        お探しの国またはページは存在しません。
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
