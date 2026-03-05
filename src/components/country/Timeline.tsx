/**
 * 手続きの流れ（時系列）
 * 各ステップをドット＋縦ラインで繋いで表示する。
 */

import type { TimelineStep } from "@/types/enhanced";

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* ドット＋縦ライン */}
            <div className="flex flex-col items-center">
              <div
                className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${
                  step.isRequired
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 bg-white"
                }`}
              />
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-gray-100 my-1" />
              )}
            </div>

            {/* コンテンツ */}
            <div className="pb-6">
              <span className="text-xs font-medium text-gray-400">
                {step.phase}
              </span>
              <h3 className="mt-0.5 font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
