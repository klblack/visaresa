/**
 * 更新履歴
 * 日付と変更メモを一覧表示する。
 */

import type { ChangeLogEntry } from "@/types/enhanced";
import { formatDateJa } from "@/lib/utils";

interface ChangeLogProps {
  entries: ChangeLogEntry[];
}

export default function ChangeLog({ entries }: ChangeLogProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-bold text-gray-900">更新履歴</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-400">更新履歴はまだありません</p>
      ) : (
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-50">
            {entries.map((entry, i) => (
              <tr key={i}>
                <td className="py-2.5 pr-4 align-top text-xs whitespace-nowrap text-gray-400">
                  {formatDateJa(entry.date)}
                </td>
                <td className="py-2.5 text-gray-600">{entry.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
