import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  History,
} from "lucide-react";
import UniversalModal from "@/components/modals/UniversalModal";
import { ordersAPI } from "@/lib/api";
import { formatDate } from "@/utils/dateFormatter";

interface OrderEventRow {
  id: number;
  sim_id: number | null;
  partner_id: number | null;
  event: string;
  severity: "info" | "warning" | "error" | string;
  message: string | null;
  meta: unknown;
  created_at: string;
}

interface SimSnapshot {
  id: number;
  partner_id: number | null;
  status: string | null;
  sim_status: string | null;
  iccid: string | null;
  order_tid: string | null;
  order_code: string | null;
  response: unknown;
  created_at: string;
  updated_at: string | null;
}

interface TransactionSnapshot {
  id: number;
  status: string;
  amount: string;
  created_at: string;
  updated_at: string | null;
}

interface OrderHistoryResponse {
  success: boolean;
  data: {
    order: { id: number; status: string; created_at: string; updated_at: string | null };
    transactions: TransactionSnapshot[];
    timeline: OrderEventRow[];
    sims: SimSnapshot[];
  };
}

const PARTNER_NAMES: Record<number, string> = {
  1: "JoyTel",
  2: "BillionConnect",
};

// Технические имена событий -> понятная подпись. Новые события, которых ещё
// нет в словаре, просто показываются как есть — ничего не теряется.
const EVENT_LABELS: Record<string, string> = {
  // Заказ и оплата
  order_created: "Заказ создан",
  payment_link_created: "Ссылка на оплату получена от Т-Банка",
  payment_link_failed: "Не удалось получить ссылку на оплату",
  payment_webhook_signature_mismatch: "Подпись вебхука Т-Банка не совпала",
  payment_failed: "Т-Банк прислал отказ по оплате",
  payment_confirmed: "Оплата подтверждена Т-Банком",
  payment_webhook_duplicate: "Повторный вебхук оплаты — пропущен",
  order_processing_started: "Начата выдача eSIM",
  order_completed: "Все eSIM заказа выданы",
  order_has_failed_sims: "Часть eSIM не выдана",

  // JoyTel
  joytel_submit_requested: "Заявка отправлена в JoyTel",
  joytel_submit_succeeded: "JoyTel принял заказ",
  joytel_submit_failed: "JoyTel отклонил заказ",
  joytel_snpin_query_pending: "Проверили статус — snPin ещё не готов",
  joytel_snpin_query_succeeded: "snPin получен проверкой статуса (без колбэка)",
  joytel_snpin_query_raced_callback: "snPin уже применён колбэком",
  joytel_snpin_query_failed: "Проверка статуса не удалась",
  joytel_snpin_callback_received: "Пришёл колбэк с snPin",
  joytel_snpin_callback_raced_query: "snPin уже применён проверкой статуса",
  joytel_qr_requested: "Запрошен QR-код",
  joytel_qr_request_failed: "Не удалось запросить QR-код",
  joytel_qr_callback_received: "Пришёл QR-код — eSIM готова",
  joytel_qr_callback_post_processing_failed:
    "QR получен, но уведомление клиенту не отправилось",

  // BillionConnect
  billionconnect_submit_requested: "Заявка отправлена в BillionConnect",
  billionconnect_submit_succeeded: "BillionConnect принял заказ",
  billionconnect_submit_failed: "BillionConnect отклонил заказ",
  billionconnect_callback_received: "Пришёл финальный колбэк — eSIM готова",
  billionconnect_callback_post_processing_failed:
    "eSIM готова, но уведомление клиенту не отправилось",
};

function eventLabel(event: string) {
  return EVENT_LABELS[event] ?? event;
}

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "error") {
    return <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />;
  }
  if (severity === "warning") {
    return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
  }
  return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />;
}

function TimelineRow({ event }: { event: OrderEventRow }) {
  const hasMeta =
    event.meta !== null && event.meta !== undefined && Object.keys(event.meta as object).length > 0;
  const partnerName = event.partner_id ? PARTNER_NAMES[event.partner_id] : null;

  return (
    <li className="relative pl-6 pb-4 last:pb-0">
      <span className="absolute left-[7px] top-5 bottom-0 w-px bg-gray-200" />
      <span className="absolute left-0 top-[3px]">
        <SeverityIcon severity={event.severity} />
      </span>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          className={`text-sm font-medium ${
            event.severity === "error"
              ? "text-red-700"
              : event.severity === "warning"
                ? "text-amber-700"
                : "text-gray-900"
          }`}
        >
          {eventLabel(event.event)}
        </span>
        {(event.sim_id || partnerName) && (
          <span className="text-[11px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
            {partnerName ?? "eSIM"}
            {event.sim_id ? ` · #${event.sim_id}` : ""}
          </span>
        )}
        <span className="text-xs text-gray-400">{formatDate(event.created_at)}</span>
      </div>
      {event.message && (
        <p className="text-xs text-gray-600 mt-0.5 break-words">{event.message}</p>
      )}
      {hasMeta && (
        <details className="mt-1">
          <summary className="text-xs text-main-blue cursor-pointer select-none">
            Подробности
          </summary>
          <pre className="mt-1 text-[11px] bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all">
            {JSON.stringify(event.meta, null, 2)}
          </pre>
        </details>
      )}
    </li>
  );
}

function FallbackSimSnapshot({ sim }: { sim: SimSnapshot }) {
  const partnerName = (sim.partner_id && PARTNER_NAMES[sim.partner_id]) || "Неизвестный партнёр";

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-sm text-gray-600">
      <p className="font-medium text-gray-700">
        SIM #{sim.id} · {partnerName} · {sim.status ?? "—"}
      </p>
      {Boolean(sim.response) && (
        <details className="mt-1">
          <summary className="text-xs text-main-blue cursor-pointer select-none">
            Последний сохранённый ответ партнёра
          </summary>
          <pre className="mt-1 text-[11px] bg-white border border-gray-200 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all">
            {JSON.stringify(sim.response, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

interface OrderHistoryModalProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
}

function OrderHistoryModal({ orderId, isOpen, onClose }: OrderHistoryModalProps) {
  const { data, isLoading, isError } = useQuery<{ data: OrderHistoryResponse }>({
    queryKey: ["order-history", orderId],
    queryFn: () => ordersAPI.getOrderHistory(orderId),
    enabled: isOpen,
  });

  const timeline = data?.data?.data?.timeline ?? [];
  const sims = data?.data?.data?.sims ?? [];
  // Заказы, оформленные до появления этой истории, будут иметь пустой
  // timeline — тогда показываем снимок текущего состояния по каждой eSIM.
  const hasTimeline = timeline.length > 0;

  return (
    <UniversalModal
      isShow={isOpen}
      title={`История заказа #${orderId}`}
      btnText="Закрыть"
      isButtonsDisabled
      onClose={onClose}
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onClose();
      }}
      loading={false}
      width="min-w-[700px]"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {isLoading && (
          <p className="text-sm text-gray-500">Загружаем историю…</p>
        )}
        {isError && (
          <p className="text-sm text-red-600">
            Не удалось загрузить историю заказа.
          </p>
        )}

        {!isLoading && !isError && hasTimeline && (
          <ul className="space-y-0">
            {timeline.map((event) => (
              <TimelineRow key={event.id} event={event} />
            ))}
          </ul>
        )}

        {!isLoading && !isError && !hasTimeline && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <History className="w-4 h-4" /> Заказ оформлен до появления
              пошаговой истории — показываем текущее состояние.
            </p>
            {sims.map((sim) => (
              <FallbackSimSnapshot key={sim.id} sim={sim} />
            ))}
          </div>
        )}
      </div>
    </UniversalModal>
  );
}

export default OrderHistoryModal;
