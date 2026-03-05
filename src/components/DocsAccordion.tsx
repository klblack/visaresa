"use client";

/**
 * 必要書類アコーディオン（Client Component）
 * デフォルト折りたたみ、クリックで展開する。
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DocsAccordionProps {
  docs: string[];
}

export default function DocsAccordion({ docs }: DocsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900">
          必要書類
          <span className="ml-2 text-sm font-normal text-gray-400">
            {docs.length}件
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="space-y-2.5 px-6 pb-5">
          {docs.map((doc, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
              {doc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
