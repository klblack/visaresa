"use client";

/**
 * 条件バー（Sticky）
 * 現在の表示条件（国籍・目的・滞在日数）を常時表示する。
 * MVPでは固定値のみ表示。
 */

import type { EnhancedConditions } from "@/types/enhanced";

interface ConditionsBarProps {
  conditions: EnhancedConditions;
}

export default function ConditionsBar({ conditions }: ConditionsBarProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 overflow-x-auto py-3">
        <span className="shrink-0 text-xs text-gray-400">表示条件：</span>
        <Chip>🇯🇵 {conditions.nationality}</Chip>
        <Divider />
        <Chip>✈️ {conditions.purpose}</Chip>
        <Divider />
        <Chip>📅 {conditions.maxStayDays}日以内</Chip>
        <span className="ml-auto shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
          デフォルト固定
        </span>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

function Divider() {
  return <span className="shrink-0 text-gray-200">·</span>;
}
