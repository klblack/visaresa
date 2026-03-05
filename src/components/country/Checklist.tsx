"use client";

/**
 * 渡航前チェックリスト
 * コピーボタンでテキストとしてクリップボードにコピーできる。
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ChecklistProps {
  countryName: string;
  items: string[];
}

export default function Checklist({ countryName, items }: ChecklistProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = [
      `${countryName}渡航チェックリスト`,
      ...items.map((item) => `□ ${item}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="font-bold text-gray-900">渡航前チェックリスト</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
                     text-gray-600 transition-colors hover:bg-gray-100"
        >
          {copied ? (
            <Check size={13} className="text-emerald-500" />
          ) : (
            <Copy size={13} />
          )}
          {copied ? "コピー済み" : "コピー"}
        </button>
      </div>
      <ul className="divide-y divide-gray-50">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3">
            <span className="mt-0.5 select-none text-gray-200">□</span>
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
