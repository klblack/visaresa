/**
 * 情報ソース・更新ポリシー
 * 情報の出典・信頼性・更新方針を説明する静的ページ。
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "情報ソース・更新ポリシー",
  description: "VISARESAが掲載するビザ情報の出典・収集方法・更新方針について。",
};

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
        >
          <ArrowLeft size={15} />
          ホーム
        </Link>
      </div>

      <h1 className="mb-8 text-2xl font-black text-gray-900">
        情報ソース・更新ポリシー
      </h1>

      <div className="space-y-8 text-sm leading-relaxed text-gray-600">
        <Section title="情報の出典">
          <p>
            VISARESAが掲載するビザ情報は、以下の公式情報源を一次ソースとしています。
          </p>
          <ul className="mt-3 space-y-2">
            <SourceItem
              label="各国政府・入国管理局の公式サイト"
              note="査証要件・入国条件の一次ソース"
            />
            <SourceItem
              label="外務省「海外安全情報」「海外渡航・滞在情報」"
              note="日本政府による公式渡航情報"
            />
            <SourceItem
              label="駐日大使館・領事館の公式ウェブサイト"
              note="申請手続き・必要書類の詳細"
            />
          </ul>
        </Section>

        <Section title="更新方針">
          <p>
            ビザ要件は各国政府の政策変更により予告なく変わります。当サービスでは以下の方針で情報を更新しています。
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-4">
            <li>国別ページの「確認日」は最終確認日を示します</li>
            <li>公式情報に変更が確認された場合、速やかに反映します</li>
            <li>更新内容は各国ページの「更新履歴」に記録されます</li>
          </ul>
        </Section>

        <Section title="免責事項">
          <p>
            本サービスはあくまで参考情報の提供を目的としており、入国を保証するものではありません。
            渡航前には必ず各国政府・外務省の最新公式情報をご確認の上、ご自身の責任で渡航してください。
          </p>
          <p className="mt-2">
            掲載情報の誤りや変更に気づいた場合は、お知らせいただけると幸いです。
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </h2>
      {children}
    </div>
  );
}

function SourceItem({ label, note }: { label: string; note: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
      <span>
        <span className="font-medium text-gray-900">{label}</span>
        <span className="ml-1.5 text-xs text-gray-400">– {note}</span>
      </span>
    </li>
  );
}
