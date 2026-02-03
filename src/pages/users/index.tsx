import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { referenceAPI } from "@/lib/api";

import CustomTable from "@/components/tables/CustomTable";
import { userColumns } from "@/constants/tableColumns";
import { size } from "@/constants/paginationStuffs";

function Users() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data: response, isLoading } = useQuery({
    queryKey: ["users", params],
    queryFn: () => referenceAPI.getUsers({ size, ...params }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded shadow-sm border overflow-hidden h-full">
        <CustomTable
          columns={userColumns}
          data={response?.data ?? []}
          isLoading={isLoading}
          skeletonCount={10}
          hasPagination={true}
          pagination={response?.meta}
          defaultPageSize={response?.meta?.totalSize}
          viewPath="/users/view"
        />
      </div>
    </div>
  );
}

export default Users;
