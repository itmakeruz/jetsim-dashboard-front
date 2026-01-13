import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/lib/api";

const DataContext = createContext<any>(null);

export const useDataContext = () => useContext(DataContext);

// Color palette for top products
const colors = [
  "#3873D3",
  "#F0A500",
  "#FF6347",
  "#50C878",
  "#9370DB",
  "#FF69B4",
  "#20B2AA",
  "#FFD700",
  "#FF4500",
  "#00CED1",
];

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // Filters state
  const [filters, setFilters] = useState({
    date_from: null,
    date_to: null,
  });

  // Fetch dashboard data with date filter - only if both dates are selected
  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ["dashboard", filters.date_from, filters.date_to],
    queryFn: () => {
      const params: any = {};

      // Format date as date_from_date_to if both dates exist
      if (filters.date_from && filters.date_to) {
        params.date = `${filters.date_from}_${filters.date_to}`;
      }

      return dashboardAPI.getDashboard(params);
    },
    enabled: !!(filters.date_from && filters.date_to), // Only fetch if both dates are selected
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const dashboardData = dashboardResponse?.data?.data || {};

  // Transform API data to component format
  const currentData = useMemo(() => {
    const stats = [
      {
        id: 1,
        title: "Всего заказов",
        value: dashboardData.total_orders || 0,
      },
      {
        id: 2,
        title: "Активные заказы",
        value: dashboardData.active_orders || 0,
      },
      {
        id: 3,
        title: "Общая выручка",
        value: dashboardData.total_revenue || 0,
        currency: "₽",
      },
      {
        id: 4,
        title: "Новые клиенты",
        value: dashboardData.new_clients || 0,
      },
    ];

    const topProducts =
      dashboardData.top_tariffs?.map((tariff: any, index: number) => ({
        id: tariff.id,
        title: tariff.name_ru || tariff.name_en || "Unknown",
        sold: tariff.sold || 0,
        color: colors[index % colors.length],
      })) || [];

    // Transform daily sales to chart format
    const chartDatas = {
      percent: null, // API doesn't provide this
      summ: dashboardData.total_revenue || 0,
      datas:
        dashboardData.daily_sales?.map((item: any) => ({
          name: new Date(item.day).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
          }),
          total_amount: item.total || 0,
        })) || [],
    };

    return {
      stats,
      topProducts,
      chartDatas,
    };
  }, [dashboardData]);

  const monthlyComparison = {
    current_month: {
      name: new Date().toLocaleDateString("ru-RU", { month: "long" }),
      total_amount: dashboardData.total_revenue || 0,
    },
    previous_month: {
      name: new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      ).toLocaleDateString("ru-RU", { month: "long" }),
      total_amount: 0, // API doesn't provide previous month data
    },
    percentage_change: null, // API doesn't provide this
  };

  return (
    <DataContext.Provider
      value={{
        filters,
        setFilters,
        currentData,
        monthlyComparison,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
