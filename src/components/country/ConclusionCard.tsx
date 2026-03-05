/**
 * 結論カード
 * 入国要件を ✅必須 / ⚠️条件付き / ⛔不要 の3分類で視覚的に表示する。
 */

import { ExternalLink } from "lucide-react";
import type { ConclusionItem } from "@/types/enhanced";

interface ConclusionCardProps {
  required: ConclusionItem[];
  conditional: ConclusionItem[];
  notRequired: string[];
}

export default function ConclusionCard({
  required,
  conditional,
  notRequired,
}: ConclusionCardProps) {
  return (
    <div className="space-y-3">
      {/* ✅ 必須 */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="bg-emerald-500 px-5 py-3">
          <span className="font-bold text-white">✅ 必須</span>
        </div>
        <div className="divide-y divide-gray-50">
          {required.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* ⚠️ 条件付き */}
      {conditional.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
          <div className="bg-yellow-400 px-5 py-3">
            <span className="font-bold text-amber-900">⚠️ 条件付き</span>
          </div>
          <div className="divide-y divide-gray-50">
            {conditional.map((item) => (
              <ConditionalRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ⛔ 不要 */}
      {notRequired.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gray-100 px-5 py-3">
            <span className="font-bold text-gray-500">⛔ 不要（日本国籍・観光・90日以内）</span>
          </div>
          <ul className="space-y-1.5 px-5 py-4">
            {notRequired.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="mt-0.5 text-gray-300">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ItemRow({ item }: { item: ConclusionItem }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4">
      <div className="flex-1 space-y-1">
        <p className="font-semibold text-gray-900">{item.title}</p>
        <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
        {item.fee && (
          <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            {item.fee}
          </span>
        )}
      </div>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          公式 <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

function ConditionalRow({ item }: { item: ConclusionItem }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4">
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-gray-900">{item.title}</p>
          {item.badge && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {item.badge}
            </span>
          )}
        </div>
        {item.condition && (
          <p className="text-xs text-amber-700">適用条件: {item.condition}</p>
        )}
        <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
      </div>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          詳細 <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}
