"use client";

/**
 * 免責事項同意モーダル
 * 初回アクセス時に表示し、同意なしではサービスを使えないようにする。
 * 同意状態は localStorage に保存し、ページリロード後も保持する。
 * 同意記録は Supabase の consent_logs テーブルにも保存する。
 */

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateSessionId } from "@/lib/utils";

// 免責事項のバージョン（改訂したらここを更新し、再同意を促す）
const DISCLAIMER_VERSION = "1.0";
const STORAGE_KEY = `visaresa_consent_v${DISCLAIMER_VERSION}`;

// onConsent プロップは持たない設計：モーダルが localStorage を独立管理するため不要
export default function DisclaimerModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // マウント時に同意済みかチェック
  // SSR では localStorage が使えないため useEffect 内で実行する
  useEffect(() => {
    const hasConsented = localStorage.getItem(STORAGE_KEY);
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  /**
   * 同意ボタン押下時の処理
   * 1. localStorage に同意を記録（次回アクセス時のスキップ用）
   * 2. Supabase の consent_logs に記録（法的証拠用）
   * 3. モーダルを閉じて親コンポーネントに通知
   */
  async function handleConsent() {
    if (!isChecked) return;
    setIsLoading(true);

    try {
      // セッション ID を取得または生成
      let sessionId = sessionStorage.getItem("visaresa_session_id");
      if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem("visaresa_session_id", sessionId);
      }

      // Supabase に同意記録を保存（失敗してもUXを壊さない）
      const supabase = createClient();
      await supabase.from("consent_logs").insert({
        session_id: sessionId,
        version: DISCLAIMER_VERSION,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      // DB 保存失敗はログのみ（UX を止めない設計）
      console.error("consent_logs への保存に失敗:", error);
    }

    // localStorage に同意フラグを保存（次回スキップ用）
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());

    setIsLoading(false);
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    // 背景オーバーレイ（クリックしても閉じない設計）
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* ヘッダー */}
        <div className="rounded-t-2xl bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            ご利用前にご確認ください
          </h2>
          <p className="mt-1 text-sm text-blue-100">
            VISARESA 免責事項・利用規約
          </p>
        </div>

        {/* 免責事項本文 */}
        <div className="max-h-64 overflow-y-auto px-6 py-4 text-sm text-gray-700">
          <p className="mb-3 font-semibold text-gray-900">
            【重要】ビザ情報に関する免責事項
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
              <span>
                本サービスのビザ情報は参考情報であり、
                <strong>最新の正確性を保証するものではありません。</strong>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
              <span>
                ビザ要件は各国の政策変更により予告なく変わる場合があります。
                <strong>
                  渡航前には必ず各国大使館・公式機関で最新情報をご確認ください。
                </strong>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-blue-500">ℹ</span>
              <span>
                本サービスの情報に基づく渡航トラブル（入国拒否、ビザ申請費用等）について、
                当サービスは一切の責任を負いかねます。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-blue-500">ℹ</span>
              <span>
                外務省の
                <a
                  href="https://www.mofa.go.jp/mofaj/toko/visa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  海外安全情報
                </a>
                および渡航先の在日大使館公式サイトを必ずご参照ください。
              </span>
            </li>
          </ul>
        </div>

        {/* 同意チェックボックス */}
        <div className="border-t px-6 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm text-gray-700">
              上記の免責事項を理解し、本サービスの情報はあくまで参考として利用することに同意します。
            </span>
          </label>
        </div>

        {/* ボタン */}
        <div className="rounded-b-2xl bg-gray-50 px-6 py-4">
          <button
            onClick={handleConsent}
            disabled={!isChecked || isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white
                       transition-colors hover:bg-blue-700
                       disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isLoading ? "処理中..." : "同意してサービスを利用する"}
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            同意いただけない場合はページを閉じてください
          </p>
        </div>
      </div>
    </div>
  );
}
