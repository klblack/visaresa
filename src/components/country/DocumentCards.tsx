/**
 * 必要書類カード
 * 各書類を個別カードで表示。必須/任意バッジ付き。
 */

import { ExternalLink } from "lucide-react";
import type { EnhancedDocument } from "@/types/enhanced";

interface DocumentCardsProps {
  documents: EnhancedDocument[];
}

export default function DocumentCards({ documents }: DocumentCardsProps) {
  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg" aria-hidden="true">📄</span>
                  <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      doc.isRequired
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {doc.isRequired ? "必須" : "任意"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {doc.description}
                </p>
              </div>
            </div>
          </div>

          {doc.officialUrl && (
            <div className="border-t border-gray-50 px-5 py-3">
              <a
                href={doc.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900
                           px-4 py-2.5 text-sm font-semibold text-white
                           transition-colors hover:bg-gray-700"
              >
                <ExternalLink size={14} />
                公式申請ページ
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
