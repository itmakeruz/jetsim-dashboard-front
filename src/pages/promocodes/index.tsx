import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import CustomTable from "@/components/tables/CustomTable";
import { size } from "@/constants/paginationStuffs";
import { promocodeColumns } from "@/constants/tableColumns";
import { referenceAPI } from "@/lib/api";
import formatNumber from "@/utils/formatNumber";

function Promocodes() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data: response, isLoading } = useQuery({
    queryKey: ["my-promocodes", params],
    queryFn: () => referenceAPI.getMyPromocodes({ page: 1, size, ...params }),
    staleTime: 30000,
  });

  // const balance = response?.data?.data?.balance ?? 0;
  const promocodes = response?.data?.data?.items ?? [];
  const meta = response?.data?.meta;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-main-black">Промокоды</h1>

        <div className="bg-white flex items-center gap-4 border border-gray-100 rounded px-4 py-2 shadow-sm">
          <p className="text-xs text-gray-500">Баланс</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatNumber(balance)} ₽
          </p>
        </div>
      </div> */}

      <div className="bg-white rounded shadow-sm border overflow-hidden h-full">
        <CustomTable
          defaultPageSize={meta?.totalSize}
          columns={promocodeColumns}
          data={promocodes}
          isLoading={isLoading}
          skeletonCount={10}
          hasPagination={true}
          pagination={meta}
          showFullscreenButton={false}
        />
      </div>
    </div>
  );
}

export default Promocodes;
