/**
 * 渡航判定ページ
 * /check: 行き先・目的・滞在日数を入力して入国要件を判定する。
 */

import type { Metadata } from "next";
import CheckForm from "@/components/check/CheckForm";

export const metadata: Metadata = {
  title: "渡航判定",
  description: "渡航先・目的・滞在日数を入力して、日本パスポートで必要な入国要件を確認。",
};

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-black text-gray-900">渡航判定</h1>
        <p className="text-sm text-gray-400">
          渡航先・目的・滞在日数を選ぶだけで、必要な手続きを確認できます。
        </p>
      </div>
      <CheckForm />
    </div>
  );
}
