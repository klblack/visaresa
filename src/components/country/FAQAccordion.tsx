"use client";

/**
 * FAQアコーディオン
 * 1つ開くと他が閉じる排他モード。
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/types/enhanced";

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {faqs.map((faq, i) => (
        <div key={i} className={i > 0 ? "border-t border-gray-100" : ""}>
          <button
            onClick={() => toggle(i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left
                       transition-colors hover:bg-gray-50"
            aria-expanded={openIndex === i}
          >
            <span className="pr-4 text-sm font-medium text-gray-900">
              {faq.question}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && (
            <div className="bg-gray-50 px-5 pb-4">
              <p className="text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
