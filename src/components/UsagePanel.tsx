import { useState } from "react";
import axios from "@/lib/axios";
const labels: Record<string, string> = {"check": "Проверить баланс", "checking": "Проверяем…", "remaining": "Осталось трафика", "used": "Использовано", "expires": "Действует до", "days": "Осталось дней", "checked": "Проверено", "unlimited": "Безлимит", "noData": "Нет данных", "notReady": "Баланс будет доступен после выдачи eSIM", "unsupported": "Проверка баланса недоступна", "error": "Не удалось проверить баланс. Показаны последние полученные данные, если они есть.", "active": "Пакет активен", "not_activated": "Пакет ещё не активирован", "expired": "Срок пакета истёк", "depleted": "Трафик пакета исчерпан", "mb": "МБ", "daily": "Суточный лимит", "today": "Использовано сегодня"};

export interface UsageSnapshot {
  state: "active" | "not_activated" | "expired" | "depleted";
  is_unlimited: boolean;
  total_mb: number | null;
  used_mb: number;
  remaining_mb: number | null;
  daily_quota_mb: number | null;
  today_used_mb: number | null;
  total_days: number;
  remaining_days: number | null;
  activated_at: string | null;
  expires_at: string | null;
  checked_at: string;
  daily_usage: { date: string; used_mb: number }[];
}
interface Props {
  simId: number;
  status?: string | null;
  snapshot?: UsageSnapshot | null;
}
export default function UsagePanel({ simId, status, snapshot }: Props) {
  const t = (key: string) => labels[key] ?? key;
  const locale = "ru-RU";
  const [data, setData] = useState<UsageSnapshot | null>(snapshot ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resultStatus, setResultStatus] = useState<string | null>(null);
  const ready = status === "COMPLETED";
  const check = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`/sims/admin/${simId}/usage`);
      setResultStatus(response.data.status);
      if (response.data.status === "ok") setData(response.data.data);
    } catch (e: unknown) {
      const last = (e as { response?: { data?: { last_success?: { data: UsageSnapshot } } } }).response?.data?.last_success;
      if (last?.data) setData(last.data);
      setError(true);
    } finally { setLoading(false); }
  };
  const amount = (value: number | null | undefined) => value == null ? t("noData")
    : `${value.toLocaleString(locale, { maximumFractionDigits: 2 })} ${t("mb")}`;
  const date = (value?: string | null) => value && Number.isFinite(Date.parse(value))
    ? new Date(value).toLocaleString(locale) : t("noData");
  const rows = data ? [
    [t("remaining"), data.is_unlimited ? t("unlimited") : amount(data.remaining_mb)],
    [t("used"), amount(data.used_mb)],
    [t("expires"), date(data.expires_at)],
    [t("days"), data.remaining_days == null ? t("noData") : String(data.remaining_days)],
    ...(data.daily_quota_mb == null ? [] : [[t("daily"), amount(data.daily_quota_mb)], [t("today"), amount(data.today_used_mb)]]),
    [t("checked"), date(data.checked_at)],
  ] : [];
  return (
    <section className="space-y-2 rounded-xl border border-blue-100 bg-white/70 p-3 text-sm" aria-busy={loading}>
      {data && <p className="font-semibold text-[#112D6C]">{t(data.state)}</p>}
      <dl className="space-y-1">
        {rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt>{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}
      </dl>
      {!data && <p>{!ready || resultStatus === "not_ready" ? t("notReady") : resultStatus === "unsupported" ? t("unsupported") : t("noData")}</p>}
      {error && <p role="alert" className="text-amber-700">{t("error")}</p>}
      <button type="button" onClick={check} disabled={loading || !ready} className="rounded-lg bg-[#112D6C] px-3 py-2 text-white disabled:opacity-50">
        {loading ? t("checking") : t("check")}
      </button>
    </section>
  );
}
