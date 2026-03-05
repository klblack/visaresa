/**
 * 2段階結論サマリー
 * A) 出国前に必要（必須/条件付き/推奨）
 * B) 入国成立条件（必須/裁量）
 */

import { ExternalLink } from "lucide-react";
import type { CountryVisaData, RequirementItem, EntryCondition } from "@/types/enhanced";

interface Props {
  data: Pick<CountryVisaData, "preDeparture" | "entryConditions">;
}

export default function TwoStageSummary({ data }: Props) {
  const { preDeparture, entryConditions } = data;

  return (
    <div className="space-y-6">
      {/* A) 出国前に必要 */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          A) 出国前に必要（パスポート以外）
        </h3>
        <div className="space-y-3">
          {/* 必須 */}
          {preDeparture.required.length > 0 && (
            <Section
              label="必須"
              headerClass="bg-emerald-500"
              labelClass="text-white"
            >
              {preDeparture.required.map((item) => (
                <RequirementRow key={item.id} item={item} />
              ))}
            </Section>
          )}

          {/* 条件付き */}
          {preDeparture.conditional.length > 0 && (
            <Section
              label="⚠️ 条件付き"
              headerClass="bg-yellow-400"
              labelClass="text-amber-900"
            >
              {preDeparture.conditional.map((item) => (
                <RequirementRow key={item.id} item={item} showCondition />
              ))}
            </Section>
          )}

          {/* 推奨 */}
          {preDeparture.recommended.length > 0 && (
            <Section
              label="推奨"
              headerClass="bg-gray-100"
              labelClass="text-gray-600"
            >
              {preDeparture.recommended.map((item) => (
                <RequirementRow key={item.id} item={item} />
              ))}
            </Section>
          )}
        </div>
      </div>

      {/* B) 入国成立条件 */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          B) 入国成立条件
        </h3>
        <div className="space-y-3">
          {/* 必須条件 */}
          {entryConditions.required.length > 0 && (
            <Section
              label="必須条件"
              headerClass="bg-blue-600"
              labelClass="text-white"
            >
              {entryConditions.required.map((item) => (
                <EntryConditionRow key={item.id} item={item} />
              ))}
            </Section>
          )}

          {/* 裁量（確認されやすい） */}
          {entryConditions.discretionary.length > 0 && (
            <Section
              label="確認されやすい項目"
              headerClass="bg-gray-100"
              labelClass="text-gray-600"
            >
              {entryConditions.discretionary.map((item) => (
                <EntryConditionRow key={item.id} item={item} />
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  headerClass,
  labelClass,
  children,
}: {
  label: string;
  headerClass: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className={`${headerClass} px-5 py-3`}>
        <span className={`font-bold ${labelClass}`}>{label}</span>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

function RequirementRow({
  item,
  showCondition = false,
}: {
  item: RequirementItem;
  showCondition?: boolean;
}) {
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
        {showCondition && item.condition && (
          <p className="text-xs text-amber-700">適用条件: {item.condition}</p>
        )}
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

function EntryConditionRow({ item }: { item: EntryCondition }) {
  return (
    <div className="px-5 py-4 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-gray-900">{item.title}</p>
        {item.badge && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            {item.badge}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
    </div>
  );
}
