import StatusBadge from "@/components/status/StatusBadge";
import CopyButton from "@/components/CopyButton";
import SimsCellPreview from "@/components/tables/SimsCellPreview";
import { Column } from "@/components/tables/tableType";
import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/dateFormatter";
import formatNumber from "@/utils/formatNumber";
import { formatPhoneNumber } from "@/utils/phoneNumberFormatter";
import { getImageUrl } from "@/utils/imageUtils";
import { showToast } from "@/utils/toastHelper";
import { Link } from "react-router-dom";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_CLASSES,
  TRANSACTION_STATUS_CLASSES,
  TRANSACTION_STATUS_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  VERIFICATION_STATUS_CLASSES,
  SIM_ACTIVATION_OPTIONS,
  SIM_ACTIVATION_CLASSES,
} from "./statusOptions";

// Helper functions for user avatar
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    Math.abs((Math.sin(hash) * 16777215) % 16777215)
  ).toString(16);
  return "#" + "0".repeat(6 - color.length) + color;
};

// User columns
export const userColumns: Column[] = [
  {
    id: "id",
    header: "ID",
    filter: "input",
    filterPlaceholder: "ID…",
    width: 60,
  },
  {
    id: "name",
    header: "Имя",
    filter: "input",
    filterPlaceholder: "Имя…",
    render: (value, row) => (
      <div className="flex items-center gap-2">
        {row?.image ? (
          <img
            src={getImageUrl(row.image)}
            alt={value || "User"}
            className="w-8 h-8 shrink-0 rounded-full object-cover"
          />
        ) : value ? (
          <div
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white font-semibold uppercase"
            style={{ backgroundColor: stringToColor(value) }}
          >
            {getInitials(value)}
          </div>
        ) : (
          <img
            src="https://static.vecteezy.com/system/resources/previews/046/010/545/non_2x/user-icon-simple-design-free-vector.jpg"
            alt="Default user"
            className="w-8 h-8 shrink-0 rounded-full object-cover"
          />
        )}
        <span className="text-base text-main-black font-medium">
          {value || "Неизвестный пользователь"}
        </span>
      </div>
    ),
  },
  {
    id: "email",
    header: "Email",
    filter: "input",
    filterPlaceholder: "Email…",
    render: (value) => (
      <Link to={`mailto:${value}`} className="text-blue-600 font-medium">
        {value}
      </Link>
    ),
  },
  {
    id: "phone_number",
    header: "Телефон",
    filter: "input",
    filterPlaceholder: "Телефон…",
    render: (value) => (
      <Link to={`tel:${value}`} className="text-gray-600">
        {formatPhoneNumber(value) || "—"}
      </Link>
    ),
  },
  {
    id: "is_verified",
    header: "Подтвержден",
    render: (value: string) => (
      <StatusBadge
        options={VERIFICATION_STATUS_OPTIONS}
        status={value.toString()}
        classes={VERIFICATION_STATUS_CLASSES}
      />
    ),
    filter: {
      type: "select",
      options: [
        { value: "true", label: "Да" },
        { value: "false", label: "Нет" },
      ],
    },
  },
  {
    id: "created_at",
    header: "Дата",
    filter: { type: "dateRange", startKey: "date_from", endKey: "date_to" },
    render: (value) => (value ? formatDate(value, "ru") : "-"),
  },
];

// Order columns
export const orderColumns: Column[] = [
  {
    id: "id",
    header: "ID заказа",
    render: (value) => (
      <span className="font-semibold text-gray-900">{value}</span>
    ),
    // Широкий поиск оставляем здесь: по имени клиента отдельной колонки нет
    filter: "input",
    filterKey: "search",
    filterPlaceholder: "Поиск: ID, имя, email, ICCID",
    width: 60,
  },
  {
    id: "user",
    header: "Email клиента",
    filter: "input",
    filterKey: "email",
    filterPlaceholder: "Email…",
    render: (value) =>
      value?.email ? (
        <div className="flex items-center gap-1">
          <Link
            to={`mailto:${value.email}`}
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 font-medium"
          >
            {value.email}
          </Link>
          <CopyButton value={value.email} label="email" />
        </div>
      ) : (
        "—"
      ),
  },
  {
    id: "sims",
    header: "ICCID",
    filter: "input",
    filterKey: "iccid",
    filterPlaceholder: "ICCID…",
    render: (value) => <SimsCellPreview sims={value} field="iccid" copyLabel="ICCID" mono />,
  },
  {
    id: "sims",
    header: "Тариф",
    render: (value) => <SimsCellPreview sims={value} field="tariff_name" />,
  },
  {
    id: "sims",
    header: "ГБ",
    render: (value) => <SimsCellPreview sims={value} field="internet" />,
  },
  {
    id: "status",
    header: "Статус",
    render: (value: string) => (
      <StatusBadge
        options={ORDER_STATUS_OPTIONS}
        status={value}
        classes={ORDER_STATUS_CLASSES}
      />
    ),
    filter: { type: "select", options: ORDER_STATUS_OPTIONS },
  },
  {
    id: "created_at",
    header: "Период",
    filter: { type: "dateRange", startKey: "date_from", endKey: "date_to" },
    render: (value) =>
      value ? (
        <div className="text-center">{formatDate(value, "ru")}</div>
      ) : (
        "-"
      ),
  },
  {
    id: "sims",
    header: "Количество SIM",
    render: (value) => (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700">
        {value?.length || 0} SIM
      </span>
    ),
  },

  {
    id: "sims",
    header: "Общая сумма",
    render: (value) => {
      const total = value?.reduce(
        (sum: number, sim: any) => sum + (sim.tariff?.price_sell || 0),
        0
      );
      return (
        <span className="font-semibold text-green-700">
          {formatNumber(total)} ₽
        </span>
      );
    },
  },
];

// Отчёт по продажам: тариф · объём · кем · сумма · дата · статус
export const reportColumns: Column[] = [
  {
    id: "created_at",
    header: "Дата",
    filter: { type: "dateRange", startKey: "date_from", endKey: "date_to" },
    render: (value) => (value ? formatDate(value, "ru") : "—"),
  },
  {
    id: "tariff_name",
    header: "Тариф",
    filter: "input",
    filterKey: "search",
    filterPlaceholder: "Поиск: тариф, имя, email",
    render: (value) => (
      <span className="font-medium text-gray-900">{value || "—"}</span>
    ),
  },
  {
    id: "quantity_internet",
    header: "Объём",
    render: (value) => <span>{value ?? 0} GB</span>,
  },
  {
    id: "buyer_name",
    header: "Кем куплено",
    render: (_value, row) => (
      <div className="flex flex-col">
        <span className="text-gray-900">{row?.buyer_name || "—"}</span>
        {row?.buyer_email && (
          <span className="text-xs text-gray-500">{row.buyer_email}</span>
        )}
      </div>
    ),
  },
  {
    id: "amount",
    header: "Сумма",
    render: (value) => (
      <span className="font-semibold text-green-700">
        {formatNumber(value || 0)} ₽
      </span>
    ),
  },
  {
    id: "sim_status",
    header: "Статус",
    render: (value) => (
      <StatusBadge
        options={SIM_ACTIVATION_OPTIONS}
        status={value ?? "NOT_ACTIVATED"}
        classes={SIM_ACTIVATION_CLASSES}
      />
    ),
  },
];

export const transactionColumns: Column<Transaction>[] = [
  {
    id: "id",
    header: "ID",
    filter: "input",
    width: 40,
  },
  {
    id: "user.email",
    header: "Email",
    filter: "input",
    filterKey: "email",
  },
  {
    id: "amount",
    header: "Сумма",
    render: (value) => (value ? `${formatNumber(parseFloat(value))} ₽` : "-"),
    filter: "input",
  },
  {
    id: "status",
    header: "Статус",
    render: (value: string) => (
      <StatusBadge
        options={TRANSACTION_STATUS_OPTIONS}
        status={value}
        classes={TRANSACTION_STATUS_CLASSES}
      />
    ),
    filter: { type: "select", options: TRANSACTION_STATUS_OPTIONS },
  },
  {
    id: "order_id",
    header: "ID заказа",
    filter: "input",
    width: 40,
    render: (value) => (
      <Link to={`/orders?id=${value}`} className="text-blue-600 font-medium">
        {value}
      </Link>
    ),
  },
  {
    id: "created_at",
    header: "Sana oraligʻi",
    filter: { type: "dateRange", startKey: "startDate", endKey: "endDate" },
    render: (value) =>
      value ? (
        <div className="text-center">{formatDate(value, "ru")}</div>
      ) : (
        "-"
      ),
  },
];

const PROMOCODE_STATUS_CLASSES = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
};

const PROMOCODE_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Активный" },
  { value: "INACTIVE", label: "Неактивный" },
];

export const promocodeColumns: Column[] = [
  {
    id: "code",
    header: "Промокод",
    filter: "input",
    filterKey: "search",
    render: (value) => {
      const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!value) return;

        try {
          await navigator.clipboard.writeText(value);
          showToast.success("Промокод скопирован!");
        } catch {
          showToast.error("Не удалось скопировать промокод");
        }
      };

      return (
        <button
          type="button"
          onClick={handleCopy}
          className="font-semibold text-gray-900 hover:text-main-orange transition"
          title="Скопировать промокод"
        >
          {value || "-"}
        </button>
      );
    },
  },
  {
    id: "status",
    header: "Статус",
    filter: { type: "select", options: PROMOCODE_STATUS_OPTIONS },
    render: (value: string) => (
      <StatusBadge
        options={PROMOCODE_STATUS_OPTIONS}
        status={value}
        classes={PROMOCODE_STATUS_CLASSES}
      />
    ),
  },
  {
    id: "used_count",
    header: "Использовано",
    render: (value, row) => (
      <span>
        {value ?? 0}
        {row?.usage_limit ? ` / ${row.usage_limit}` : ""}
      </span>
    ),
  },
  {
    id: "client_discount_amount",
    header: "Скидка клиента",
    render: (value) => (value ? `${formatNumber(value)} ₽` : "-"),
  },
  {
    id: "agent_credit_amount",
    header: "Начисление агенту",
    render: (value) => (value ? `${formatNumber(value)} ₽` : "-"),
  },
  {
    id: "agent.name",
    header: "Агент",
    filter: "input",
    filterKey: "agent_id",
    render: (value, row) => value || row?.agent?.login || "-",
  },
  {
    id: "expires_at",
    header: "Действует до",
    render: (value) => (value ? formatDate(value, "ru") : "-"),
  },
  {
    id: "created_at",
    header: "Создан",
    render: (value) => (value ? formatDate(value, "ru") : "-"),
  },
];
