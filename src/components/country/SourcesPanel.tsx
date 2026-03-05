/**
 * 出典パネル
 * 情報源をカテゴリ別に表示する。
 */

import { ExternalLink } from "lucide-react";
import type { EnhancedSource } from "@/types/enhanced";

interface SourcesPanelProps {
  sources: EnhancedSource[];
}

const CATEGORY_BADGE: Record<string, string> = {
  政府公式: "bg-blue-100 text-blue-700",
  外務省:   "bg-purple-100 text-purple-700",
  大使館:   "bg-emerald-100 text-emerald-700",
  その他:   "bg-gray-100 text-gray-600",
};

export default function SourcesPanel({ sources }: SourcesPanelProps) {
  // カテゴリでグルーピング
  const grouped = sources.reduce<Record<string, EnhancedSource[]>>(
    (acc, s) => {
      (acc[s.category] ??= []).push(s);
      return acc;
    },
    {}
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-bold text-gray-900">出典・公式情報</h2>
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                CATEGORY_BADGE[category] ?? CATEGORY_BADGE["その他"]
              }`}
            >
              {category}
            </span>
            <ul className="mt-2 space-y-2">
              {items.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink size={12} className="shrink-0" />
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
