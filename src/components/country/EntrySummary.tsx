/**
 * 2段結論カード
 * A) 出国前に手元に必要（パスポート以外）
 * B) 入国成立条件
 * visa_info の required_docs をキーワードで分類して表示する。
 */

import { ExternalLink } from "lucide-react";
import type { VisaInfo } from "@/types/database";
import { formatDateJa } from "@/lib/utils";

interface Props {
  visa: VisaInfo;
}

// ──────────────────────────────────────────────
// 分類ロジック（required_docs → A1 / A2）
// ──────────────────────────────────────────────

const A1_REQUIRED_RE = /ESTA|eTA|ETA|NZeTA|IVL|事前取得|電子渡航認証|電子旅行許可|現金/;
const A1_CONDITIONAL_RE = /黄熱病|ワクチン/;
const A1_RECOMMENDED_RE = /旅行保険/;
const A2_REQUIRED_RE = /パスポート/;
const A2_DISCRETIONARY_RE = /航空券|帰国便|往復|住所|宿泊|ホテル|旅程計画書|滞在費|資金|残高/;

function split(docs: string[]) {
  return {
    a1Required:      docs.filter((d) => A1_REQUIRED_RE.test(d)),
    a1Conditional:   docs.filter((d) => A1_CONDITIONAL_RE.test(d)),
    a1Recommended:   docs.filter((d) => A1_RECOMMENDED_RE.test(d)),
    a2Required:      docs.filter((d) => A2_REQUIRED_RE.test(d)),
    a2Discretionary: docs.filter((d) => A2_DISCRETIONARY_RE.test(d)),
  };
}

// ──────────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────────

export default function EntrySummary({ visa }: Props) {
  const docs = visa.required_docs ?? [];
  const { a1Required, a1Conditional, a1Recommended, a2Required, a2Discretionary } = split(docs);

  const a1IsEmpty = a1Required.length === 0 && a1Conditional.length === 0;

  // A2 必須: visa_type に応じた先頭アイテムを付与
  const a2RequiredItems: string[] = [];
  if (visa.visa_type === "e_visa") {
    a2RequiredItems.push("取得済みの電子ビザ（有効であること）");
  } else if (visa.visa_type === "visa_on_arrival") {
    const fee = visa.fee_usd != null ? `費用: $${visa.fee_usd}` : "無料";
    a2RequiredItems.push(`入国ポイントでの到着ビザ手続き（${fee}）`);
  } else if (visa.visa_type === "embassy") {
    a2RequiredItems.push("有効な大使館発行ビザ");
  }
  a2RequiredItems.push(...a2Required);

  return (
    <div className="mb-6 space-y-3">
      {/* ── 前提バー ─────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-gray-50 px-4 py-2.5 text-xs">
        <span className="font-semibold text-gray-400">前提</span>
        <span className="text-gray-600">🇯🇵 日本国籍</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-600">✈️ 観光・商用</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-600">📅 短期滞在</span>
        <span className="ml-auto text-gray-400">※条件により変動</span>
      </div>

      {/* ── A) 出国前に必要 ─────────────────── */}
      <StageCard header="A) 出国前に手元に必要（パスポート以外）" headerBg="bg-gray-900">
        {a1IsEmpty ? (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            ✅ 追加手続き不要
            <span className="ml-2 text-xs font-normal text-emerald-500">
              {visa.visa_type === "visa_on_arrival"
                ? "（到着後にビザが発給されます）"
                : "（パスポートのみで入国できます）"}
            </span>
          </div>
        ) : (
          <DocGroup label="✅ 必須" labelClass="text-emerald-700" items={a1Required} />
        )}
        {a1Conditional.length > 0 && (
          <DocGroup label="⚠️ 条件付き" labelClass="text-amber-700" items={a1Conditional} />
        )}
        {a1Recommended.length > 0 && (
          <DocGroup label="ℹ️ 推奨" labelClass="text-blue-600" items={a1Recommended} />
        )}
        {visa.official_url && (
          <a
            href={visa.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            公式申請ページ <ExternalLink size={10} />
          </a>
        )}
      </StageCard>

      {/* ── B) 入国成立条件 ─────────────────── */}
      <StageCard header="B) 入国成立条件" headerBg="bg-blue-600">
        {a2RequiredItems.length > 0 && (
          <DocGroup label="⛔ 必須条件" labelClass="text-red-700" items={a2RequiredItems} />
        )}
        {a2Discretionary.length > 0 && (
          <DocGroup
            label="⚠️ 確認されやすい項目"
            labelClass="text-amber-700"
            items={a2Discretionary}
          />
        )}
      </StageCard>

      {/* ── 信頼性フッター ─────────────────── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-gray-400">
        <span>最終確認日: {formatDateJa(visa.verified_at)}</span>
        {visa.source_url && (
          <a
            href={visa.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-gray-600"
          >
            <ExternalLink size={10} />
            外務省 出典
          </a>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 内部コンポーネント
// ──────────────────────────────────────────────

function StageCard({
  header,
  headerBg,
  children,
}: {
  header: string;
  headerBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className={`${headerBg} px-5 py-3`}>
        <span className="text-sm font-bold text-white">{header}</span>
      </div>
      <div className="space-y-3 p-4">{children}</div>
    </div>
  );
}

function DocGroup({
  label,
  labelClass,
  items,
}: {
  label: string;
  labelClass: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className={`mb-1.5 text-xs font-semibold ${labelClass}`}>{label}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-0.5 shrink-0 text-gray-200">—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
