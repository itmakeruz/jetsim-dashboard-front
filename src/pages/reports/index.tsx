import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { reportsAPI } from "@/lib/api";

import CustomTable from "@/components/tables/CustomTable";
import { size } from "@/constants/paginationStuffs";
import { reportColumns } from "@/constants/tableColumns";

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

function Reports() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const query = buildParams(params);

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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded shadow-sm border overflow-hidden h-full">
        <CustomTable
          defaultPageSize={response?.meta?.totalSize}
          columns={reportColumns}
          data={response?.data ?? []}
          isLoading={isLoading}
          skeletonCount={10}
          hasPagination={true}
          pagination={response?.meta}
          showExcelButton={true}
          onExcelExport={handleExcelExport}
          showFullscreenButton={true}
        />
      </div>
    </div>
  );
}

export default Reports;
