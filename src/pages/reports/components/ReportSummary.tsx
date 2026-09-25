import formatNumber from "@/utils/formatNumber";

export interface ReportSummaryData {
  total_count: number;
  total_amount: number;
  average_amount: number;
  activated: number;
  expired: number;
  not_activated: number;
}

interface ReportSummaryProps {
  summary?: ReportSummaryData;
  isLoading: boolean;
}

const CARDS = [
  {
    key: "total_count",
    label: "Продано eSIM",
    tone: "border-blue-200 bg-blue-50/70",
    value: "text-blue-700",
    format: (s: ReportSummaryData) => formatNumber(s.total_count),
  },
  {
    key: "total_amount",
    label: "Всего заработано",
    tone: "border-emerald-200 bg-emerald-50/70",
    value: "text-emerald-700",
    format: (s: ReportSummaryData) => `${formatNumber(s.total_amount)} ₽`,
  },
  {
    key: "average_amount",
    label: "Средний чек",
    tone: "border-violet-200 bg-violet-50/70",
    value: "text-violet-700",
    format: (s: ReportSummaryData) => `${formatNumber(s.average_amount)} ₽`,
  },
  {
    key: "activated",
    label: "Активировано",
    tone: "border-green-200 bg-green-50/70",
    value: "text-green-700",
    format: (s: ReportSummaryData) => formatNumber(s.activated),
  },
  {
    key: "not_activated",
    label: "Не активировано",
    tone: "border-gray-200 bg-gray-50",
    value: "text-gray-700",
    format: (s: ReportSummaryData) => formatNumber(s.not_activated),
  },
  {
    key: "expired",
    label: "Использовано",
    tone: "border-orange-200 bg-orange-50/70",
    value: "text-orange-700",
    format: (s: ReportSummaryData) => formatNumber(s.expired),
  },
];

function ReportSummary({ summary, isLoading }: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className={`rounded-xl border px-4 py-3 ${card.tone}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
            {card.label}
          </p>

          {isLoading || !summary ? (
            <div className="mt-2 h-6 w-20 animate-pulse rounded bg-black/10" />
          ) : (
            <p className={`mt-1 text-[20px] font-bold leading-tight ${card.value}`}>
              {card.format(summary)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReportSummary;
