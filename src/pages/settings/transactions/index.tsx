import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { referenceAPI } from "@/lib/api";

import CustomTable from "@/components/tables/CustomTable";
import { size } from "@/constants/paginationStuffs";
import { transactionColumns } from "@/constants/tableColumns";

function Transactions() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data: response, isLoading } = useQuery({
    queryKey: ["drivers", params],
    queryFn: () => referenceAPI.getTransactions({ size: size, ...params }),
    staleTime: 30000,
  });

  const handleExcelExport = () => {
    // API so‘rovi keyinroq ulanadi
    // referenceAPI.exportTransactionsExcel(params) kabi
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded shadow-sm border overflow-hidden h-full">
        <CustomTable
          defaultPageSize={response?.meta.totalSize}
          columns={transactionColumns}
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

export default Transactions;
