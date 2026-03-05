"use client";

/**
 * 渡航判定フォーム
 * 行き先・目的・滞在日数を入力して /result に遷移する。
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

// 簡易的な国リスト（主要国）
const POPULAR_COUNTRIES = [
  { code: "US", name: "アメリカ" },
  { code: "FR", name: "フランス" },
  { code: "IT", name: "イタリア" },
  { code: "ES", name: "スペイン" },
  { code: "DE", name: "ドイツ" },
  { code: "GB", name: "イギリス" },
  { code: "AU", name: "オーストラリア" },
  { code: "TH", name: "タイ" },
  { code: "KR", name: "韓国" },
  { code: "TW", name: "台湾" },
];

export default function CheckForm() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState<"tourism" | "business">("tourism");
  const [days, setDays] = useState<"30" | "90" | "91plus">("90");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = POPULAR_COUNTRIES.filter((c) =>
    c.name.includes(query) || c.code.toUpperCase().includes(query.toUpperCase())
  );

  function selectCountry(code: string, name: string) {
    setCountryCode(code);
    setCountryName(name);
    setQuery(name);
    setShowDropdown(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!countryCode) return;
    const params = new URLSearchParams({
      country: countryCode,
      nationality: "JP",
      purpose,
      days,
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 行き先 */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          渡航先
        </label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCountryCode("");
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="国名を入力（例：アメリカ）"
            className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {showDropdown && query.length > 0 && filtered.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              {filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onMouseDown={() => selectCountry(c.code, c.name)}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {c.name}
                    <span className="ml-2 text-xs text-gray-400">{c.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 目的 */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          渡航目的
        </label>
        <div className="flex gap-3">
          {[
            { value: "tourism", label: "観光・短期滞在" },
            { value: "business", label: "商用・出張" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-colors ${
                purpose === opt.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="purpose"
                value={opt.value}
                checked={purpose === opt.value}
                onChange={() => setPurpose(opt.value as "tourism" | "business")}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* 滞在日数 */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          滞在予定日数
        </label>
        <div className="flex gap-3">
          {[
            { value: "30", label: "30日以内" },
            { value: "90", label: "31〜90日" },
            { value: "91plus", label: "91日以上" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 py-3 text-sm font-medium transition-colors ${
                days === opt.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="days"
                value={opt.value}
                checked={days === opt.value}
                onChange={() => setDays(opt.value as "30" | "90" | "91plus")}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* 送信 */}
      <button
        type="submit"
        disabled={!countryCode}
        className="w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      >
        入国要件を判定する
      </button>
    </form>
  );
}
