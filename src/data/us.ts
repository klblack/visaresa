/**
 * アメリカ（US）拡張ビザ情報
 * DB の visa_info を静的コンテンツで補完したもの。
 * MVPスコープ：日本国籍・観光・90日以内のデフォルト表示。
 */

import type { EnhancedCountryData } from "@/types/enhanced";

export const usData: EnhancedCountryData = {
  updatedAt: "2025-01-01",

  conditions: {
    nationality: "日本国籍",
    purpose: "観光・商用",
    maxStayDays: 90,
  },

  sources: [
    {
      title: "ESTA公式申請サイト（米国CBP）",
      url: "https://esta.cbp.dhs.gov/",
      category: "政府公式",
    },
    {
      title: "外務省 – 米国のビザ情報",
      url: "https://www.mofa.go.jp/mofaj/toko/visa/tanki/usa.html",
      category: "外務省",
    },
    {
      title: "在日米国大使館 – ビザ免除プログラム（VWP）",
      url: "https://jp.usembassy.gov/ja/visas-ja/visa-waiver-program-ja/",
      category: "大使館",
    },
  ],

  disclaimer: {
    summary:
      "この情報は参考目的のみです。渡航前に必ず公式情報をご確認ください。",
    detail:
      "入国要件・ビザ規則は米国政府の政策変更により予告なく変わります。本サービスに掲載された情報に基づく入国拒否・費用損害等について、当サービスは一切の責任を負いません。渡航前には必ず米国大使館・外務省の公式情報を確認し、ご自身の責任で渡航してください。",
  },

  conclusions: {
    required: [
      {
        id: "esta",
        title: "ESTA（電子渡航認証）",
        description:
          "渡航72時間前までに申請推奨。有効期間2年または旅券期限まで（短い方）。公式サイト以外は手数料割増のため要注意。",
        fee: "USD $21",
        url: "https://esta.cbp.dhs.gov/",
      },
      {
        id: "passport",
        title: "ICチップ搭載の電子パスポート",
        description:
          "2006年10月以降発行の電子パスポートが必須。有効期限が滞在終了日まであることを事前確認。",
      },
    ],
    conditional: [
      {
        id: "visa-b",
        title: "観光ビザ（B-2）",
        condition:
          "90日超の滞在・就労・留学・過去のビザ拒否歴・一定の犯罪歴がある場合",
        description:
          "ESTAは申請不可。在日米国大使館でBビザまたは目的に応じたビザを取得。",
        badge: "要確認",
        url: "https://jp.usembassy.gov/ja/visas-ja/",
      },
    ],
    notRequired: [
      "別途のビザ申請（日本国籍・観光・90日以内はESTAで代替）",
      "健康診断",
      "残高証明書（入国時に任意提示の場合あり）",
    ],
  },

  documents: [
    {
      id: "esta",
      title: "ESTA承認番号（印刷またはスクリーンショット）",
      description:
        "航空会社は自動確認するため提示必須ではないが、念のため保存推奨。$21をクレジットカードで支払い、通常数分〜72時間以内に承認される。",
      officialUrl: "https://esta.cbp.dhs.gov/",
      isRequired: true,
    },
    {
      id: "passport",
      title: "ICチップ搭載の電子パスポート",
      description:
        "2006年10月以降発行のものが対象。パスポート表紙にICチップマーク（カメラアイコン）があれば対応。有効期限が米国滞在終了日まであることを事前確認。",
      isRequired: true,
    },
  ],

  checklist: [
    "ESTA申請・承認済み（渡航72時間前までに申請）",
    "ICチップ搭載の電子パスポート（有効期限を確認）",
    "帰国便の予約（日付・便名をメモ）",
    "滞在先住所を英語でメモ（入国審査で聞かれる場合あり）",
    "現地緊急連絡先のメモ",
    "旅行保険加入（医療費は非常に高額。強く推奨）",
  ],

  timeline: [
    {
      phase: "渡航72時間以上前",
      title: "ESTA申請",
      description:
        "公式サイト esta.cbp.dhs.gov から申請（所要約10分）。費用$21をクレジットカードで支払い。通常数分〜72時間以内に承認。緊急渡航でも最低72時間前の申請を推奨。",
      isRequired: true,
    },
    {
      phase: "搭乗日",
      title: "空港チェックイン",
      description:
        "ESTA承認番号の提示は不要（航空会社が自動確認）。有効なパスポートを提示してチェックイン。搭乗前に航空会社のAPI（事前旅客情報）確認が入ることがある。",
      isRequired: true,
    },
    {
      phase: "機内",
      title: "税関申告書の記入（空港により異なる）",
      description:
        "CBP Form 6059B（機内配布）に記入するか、APCキオスク導入空港では電子申告（Mobile Passportアプリ等）も可能。目的地・滞在日数・持ち込み品を申告。",
      isRequired: true,
    },
    {
      phase: "到着後・入国審査",
      title: "CBP（米国税関・国境警備局）入国審査",
      description:
        "指紋採取・顔写真撮影あり。渡航目的・宿泊先・帰国便を英語で回答できると安心。Global Entryメンバーは専用キオスクを使用可。",
      isRequired: true,
    },
    {
      phase: "到着後・税関",
      title: "税関検査",
      description:
        "申告書提出後に検査官が確認。食料品（特に肉・果物）・$10,000超の現金・高額品の持ち込みに注意。",
      isRequired: true,
    },
  ],

  faqs: [
    {
      question: "ESTAとビザの違いは何ですか？",
      answer:
        "ESTAはビザではなく「電子渡航認証」です。ビザ免除プログラム（VWP）参加国の市民が、観光・商用・乗継目的で最大90日間渡航する際に使用します。就労・留学・長期滞在にはそれぞれ目的に合ったビザが必要です。",
    },
    {
      question: "ESTA申請はどこで行いますか？",
      answer:
        "米国CBP公式サイト esta.cbp.dhs.gov のみが公式窓口です。検索広告に代行サービスが表示されることがありますが、手数料が割増されます。必ずURLが「esta.cbp.dhs.gov」であることを確認してから申請してください。",
    },
    {
      question: "ESTA有効期限はいつまでですか？",
      answer:
        "承認日から2年間、またはパスポート有効期限まで（短い方）有効です。有効期間内であれば何度でも渡航でき、1回の滞在は最大90日以内です。",
    },
    {
      question: "90日を超えて滞在したい場合は？",
      answer:
        "ビザ免除プログラム（VWP）では原則として滞在延長・ステータス変更ができません。渡航前に在日米国大使館で観光ビザ（B-2）などを取得する必要があります。",
    },
    {
      question: "過去にビザ申請を拒否されたことがある場合は？",
      answer:
        "ビザ申請を1回でも拒否されたことがある場合や、一定の犯罪歴・特定国への渡航歴がある場合はESTAを申請できません。在日米国大使館でビザ申請を行ってください。",
    },
    {
      question: "入国審査では何を聞かれますか？",
      answer:
        "主に「渡航目的」「滞在先住所」「帰国日」「職業」などが英語で聞かれます。英語が不安な場合は通訳を依頼することもできます。虚偽申告は入国拒否・今後の渡航禁止につながるため、正直に答えてください。",
    },
  ],

  changeLog: [
    {
      date: "2025-01-01",
      note: "初回データ登録。ESTA手数料$21・最大滞在日数90日・VWP適用条件を確認。",
    },
  ],
};
