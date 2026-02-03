import StatusBadge from "@/components/status/StatusBadge";
import { Column } from "@/components/tables/tableType";
import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/dateFormatter";
import formatNumber from "@/utils/formatNumber";
import {
  TRANSACTION_STATUS_CLASSES,
  TRANSACTION_STATUS_OPTIONS,
} from "./statusOptions";

export const transactionColumns: Column<Transaction>[] = [
  {
    id: "id",
    header: "ID",
    filter: "input",
    filterKey: "search",
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
    id: "created_at",
    header: "Дата",
    render: (value) => (value ? formatDate(value, "ru") : "-"),
    filter: "date",
  },
];
