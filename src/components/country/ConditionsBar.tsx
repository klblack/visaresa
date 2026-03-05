"use client";

/**
 * 条件バー（Sticky）
 * 現在の表示条件（国籍・目的・滞在日数・経由地）を常時表示する。
 */

interface ConditionsBarProps {
  nationality?: string;
  purpose: string;
  stayLabel: string;
  via?: string;
}

export default function ConditionsBar({
  nationality = "日本国籍",
  purpose,
  stayLabel,
  via,
}: ConditionsBarProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 overflow-x-auto py-3">
        <span className="shrink-0 text-xs text-gray-400">表示条件：</span>
        <Chip>🇯🇵 {nationality}</Chip>
        <Divider />
        <Chip>✈️ {purpose}</Chip>
        <Divider />
        <Chip>📅 {stayLabel}</Chip>
        {via && (
          <>
            <Divider />
            <Chip>🔀 経由: {via}</Chip>
          </>
        )}
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
