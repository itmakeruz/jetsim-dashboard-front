import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { reportsAPI } from "@/lib/api";
import formatNumber from "@/utils/formatNumber";
import { formatDate } from "@/utils/dateFormatter";

import CustomTable from "@/components/tables/CustomTable";
import UniversalModal from "@/components/modals/UniversalModal";
import StatusBadge from "@/components/status/StatusBadge";
import CopyButton from "@/components/CopyButton";
import SimQrCode from "@/components/SimQrCode";
import { size } from "@/constants/paginationStuffs";
import { reportColumns } from "@/constants/tableColumns";
import ReportSummary from "./components/ReportSummary";
import {
  SIM_ACTIVATION_CLASSES,
  SIM_ACTIVATION_OPTIONS,
  SIM_ISSUE_CLASSES,
  SIM_ISSUE_OPTIONS,
} from "@/constants/statusOptions";

interface ReportRow {
  id: number;
  iccid: string | null;
  created_at: string;
  tariff_name: string;
  quantity_internet: number;
  buyer_name: string | null;
  buyer_email: string | null;
  amount: number;
  status: string | null;
  sim_status: string | null;
}

/**
 * Таблица фильтрует период двумя параметрами (date_from/date_to),
 * а бэкенд принимает один — "<начало>_<конец>", тот же контракт, что у /dashboard.
 */
const buildParams = (params: Record<string, string>) => {
  const { date_from, date_to, ...rest } = params;
  const query: Record<string, any> = { size, ...rest };

  if (date_from && date_to) {
    query.date = `${date_from}_${date_to}`;
  }

  return query;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <div className="text-sm text-gray-900">{children}</div>
  </div>
);

function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const query = buildParams(params);

  const [selectedRow, setSelectedRow] = useState<ReportRow | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["reports-sales", query],
    queryFn: () => reportsAPI.getSales(query),
    staleTime: 30000,
  });

  const handleExcelExport = async () => {
    try {
      const { data } = await reportsAPI.getSalesExcel(query);
      const url = URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `otchot-po-prodazham-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка выгрузки отчёта:", err);
    }
  };

  const hasFilters = Object.keys(params).some(
    (key) => key !== "page" && key !== "size"
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <ReportSummary summary={response?.summary} isLoading={isLoading} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3">
        <p className="text-sm text-gray-600">
          Найдено записей:{" "}
          <span className="font-semibold text-gray-900">
            {isLoading ? "…" : formatNumber(response?.meta?.totalItems ?? 0)}
          </span>
        </p>

        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Очистить фильтры
            </button>
          )}

          <button
            type="button"
            onClick={handleExcelExport}
            className="rounded-lg bg-[#1978E5] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1565C0]"
          >
            Экспорт в Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border overflow-hidden h-full">
        <CustomTable
          defaultPageSize={response?.meta?.totalSize}
          columns={reportColumns}
          data={response?.data ?? []}
          isLoading={isLoading}
          skeletonCount={10}
          hasPagination={true}
          pagination={response?.meta}
          showFullscreenButton={true}
          onRowClick={(row: ReportRow) => setSelectedRow(row)}
        />
      </div>

      {selectedRow && (
        <UniversalModal
          isShow={true}
          title={`eSIM #${selectedRow.id}`}
          btnText="Закрыть"
          onClose={() => setSelectedRow(null)}
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            setSelectedRow(null);
          }}
          loading={false}
          width="min-w-[700px]"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Информация о продаже
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge
                    options={SIM_ACTIVATION_OPTIONS}
                    status={selectedRow.sim_status ?? "NOT_ACTIVATED"}
                    classes={SIM_ACTIVATION_CLASSES}
                  />
                  <StatusBadge
                    options={SIM_ISSUE_OPTIONS}
                    status={selectedRow.status}
                    classes={SIM_ISSUE_CLASSES}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Дата продажи">
                  {selectedRow.created_at ? formatDate(selectedRow.created_at, "ru") : "—"}
                </Field>

                <Field label="ICCID">
                  {selectedRow.iccid ? (
                    <span className="flex items-center gap-1">
                      <span className="font-mono break-all">{selectedRow.iccid}</span>
                      <CopyButton value={selectedRow.iccid} label="ICCID" />
                    </span>
                  ) : (
                    "—"
                  )}
                </Field>

                <Field label="Тариф">{selectedRow.tariff_name || "—"}</Field>

                <Field label="Объём">{selectedRow.quantity_internet ?? 0} GB</Field>

                <Field label="Покупатель">{selectedRow.buyer_name || "—"}</Field>

                <Field label="Email">
                  {selectedRow.buyer_email ? (
                    <span className="flex items-center gap-1">
                      <span className="break-all">{selectedRow.buyer_email}</span>
                      <CopyButton value={selectedRow.buyer_email} label="email" />
                    </span>
                  ) : (
                    "—"
                  )}
                </Field>

                <Field label="Сумма">
                  <span className="font-semibold text-green-700">
                    {formatNumber(selectedRow.amount || 0)} ₽
                  </span>
                </Field>
              </div>
            </div>

            <SimQrCode simId={selectedRow.id} />
          </div>
        </UniversalModal>
      )}
    </div>
  );
}

export default Reports;
