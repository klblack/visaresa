"use client";

/**
 * 国名検索バー
 * リアルタイムで国名（日本語・英語）を検索してサジェストを表示する。
 * キーボードナビゲーション対応（↑↓キーでリスト選択、Enterで遷移）。
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Country } from "@/types/database";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // キーボード選択中のインデックス
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /**
   * 入力値が変わるたびに Supabase を検索する
   * 2文字未満の場合は検索しない（パフォーマンス考慮）
   * debounce は useEffect の cleanup で実現する
   */
  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const supabase = createClient();

      // 日本語名と英語名の両方で部分一致検索
      const { data } = await supabase
        .from("countries")
        .select("*")
        .or(`name_ja.ilike.%${query}%,name_en.ilike.%${query}%`)
        .limit(8);

      setResults(data ?? []);
      setIsOpen(true);
      setIsLoading(false);
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  /**
   * 国を選択して詳細ページに遷移する
   */
  const selectCountry = useCallback(
    (country: Country) => {
      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
      router.push(`/countries/${country.iso_code.toLowerCase()}`);
    },
    [router]
  );

  /**
   * キーボードナビゲーション処理
   * ↑↓: リスト内移動, Enter: 選択, Escape: 閉じる
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          selectCountry(results[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      {/* 検索入力フィールド */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="国名を入力（例：タイ、Thailand）"
          className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-12
                     text-gray-900 shadow-sm outline-none ring-0
                     transition-shadow focus:border-blue-400 focus:shadow-md"
          aria-label="渡航先の国名を検索"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {/* クリアボタン */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="検索をクリア"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* サジェストリスト */}
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute top-full z-20 mt-2 w-full overflow-hidden
                     rounded-xl border border-gray-100 bg-white shadow-xl"
          role="listbox"
          aria-label="検索結果"
        >
          {isLoading ? (
            <li className="px-4 py-3 text-sm text-gray-500">検索中...</li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">
              「{query}」に一致する国が見つかりません
            </li>
          ) : (
            results.map((country, index) => (
              <li
                key={country.id}
                role="option"
                aria-selected={index === activeIndex}
                onClick={() => selectCountry(country)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors
                  ${index === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"}`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {country.flag_emoji ?? "🏳"}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{country.name_ja}</p>
                  <p className="text-xs text-gray-400">{country.name_en}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">
                  {country.region}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
