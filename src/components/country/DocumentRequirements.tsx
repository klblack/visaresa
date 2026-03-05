/**
 * 必要書類（分類表示）
 * required_docs をキーワードで3分類して表示する。
 * ✅ 必須 / ⚠️ 条件付き / ℹ️ 推奨
 * 元の文字列はすべて保持し、分類して再配置する。
 */

interface Props {
  docs: string[];
}

type DocClass = "required" | "conditional" | "recommended";

// ──────────────────────────────────────────────
// 分類ロジック
// ──────────────────────────────────────────────

function classify(doc: string): DocClass {
  if (/旅行保険/.test(doc)) return "recommended";
  if (/航空券|帰国便|往復/.test(doc)) return "conditional";
  if (/住所|宿泊|ホテル|旅程計画書/.test(doc)) return "conditional";
  if (/滞在費|資金|残高/.test(doc)) return "conditional";
  if (/黄熱病|ワクチン/.test(doc)) return "conditional";
  return "required";
}

// ──────────────────────────────────────────────
// 表示設定
// ──────────────────────────────────────────────

const SECTIONS: {
  key: DocClass;
  badge: string;
  note: string;
  badgeClass: string;
}[] = [
  {
    key: "required",
    badge: "✅ 必須",
    note: "ないと止まりやすい",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "conditional",
    badge: "⚠️ 条件付き",
    note: "入国審査で提示を求められる可能性",
    badgeClass: "bg-amber-50 text-amber-700",
  },
  {
    key: "recommended",
    badge: "ℹ️ 推奨",
    note: "リスク低減",
    badgeClass: "bg-blue-50 text-blue-700",
  },
];

// ──────────────────────────────────────────────
// メインコンポーネント
// ──────────────────────────────────────────────

export default function DocumentRequirements({ docs }: Props) {
  if (!docs || docs.length === 0) return null;

  const grouped: Record<DocClass, string[]> = {
    required: [],
    conditional: [],
    recommended: [],
  };
  docs.forEach((doc) => grouped[classify(doc)].push(doc));

  const hasAny = Object.values(grouped).some((g) => g.length > 0);
  if (!hasAny) return null;

  return (
    <div className="border-t border-gray-100 px-5 py-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        必要書類
      </p>
      {SECTIONS.map(({ key, badge, note, badgeClass }) => {
        const items = grouped[key];
        if (items.length === 0) return null;
        return (
          <div key={key}>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${badgeClass}`}
              >
                {badge}
              </span>
              <span className="text-xs text-gray-400">{note}</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              {items.map((doc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 shrink-0 text-gray-300">·</span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
