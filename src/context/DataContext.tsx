import React, { createContext, useContext, useState, useMemo } from "react";
import { mockDashboardStats, mockChartData } from "@/data/mockData";

const DataContext = createContext<any>(null);

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // Filters state
  const [filters, setFilters] = useState({
    date_from: null,
    date_to: null,
    user_id: null,
    branch_id: null,
    group_id: null,
  });

  // Mock dashboard data
  const currentData = useMemo(() => {
    const stats = [
      {
        id: 1,
        title: "Всего заказов",
        value: mockDashboardStats.total_orders,
        percent: mockDashboardStats.orders_change,
      },
      {
        id: 2,
        title: "Активные заказы",
        value: mockDashboardStats.active_orders,
      },
      {
        id: 3,
        title: "Общая выручка",
        value: mockDashboardStats.total_revenue,
        currency: "сум",
        percent: mockDashboardStats.revenue_change,
      },
      {
        id: 4,
        title: "Новые клиенты",
        value: mockDashboardStats.new_customers,
        percent: mockDashboardStats.customers_change,
      },
    ];

    const topProducts = [
      {
        id: 1,
        title: "Europe Basic",
        percentage: 45,
        color: "#3873D3",
      },
      {
        id: 2,
        title: "Asia Premium",
        percentage: 30,
        color: "#F0A500",
      },
      {
        id: 3,
        title: "USA Standard",
        percentage: 25,
        color: "#FF6347",
      },
    ];

    const chartDatas = {
      percent: mockDashboardStats.revenue_change,
      summ: mockDashboardStats.total_revenue,
      datas: mockChartData.map((item) => ({
        name: new Date(item.date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "short",
        }),
        total_amount: item.revenue,
        product_amount: item.revenue * 0.6,
        simcard_amount: item.revenue * 0.4,
        orders_count: item.orders,
      })),
    };

    return {
      stats,
      topProducts,
      chartDatas,
    };
  }, [filters]);

  const monthlyComparison = {
    current_month: {
      name: new Date().toLocaleDateString("ru-RU", { month: "long" }),
      total_amount: mockDashboardStats.total_revenue,
    },
    previous_month: {
      name: new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      ).toLocaleDateString("ru-RU", { month: "long" }),
      total_amount:
        mockDashboardStats.total_revenue /
        (1 + mockDashboardStats.revenue_change / 100),
    },
    percentage_change: mockDashboardStats.revenue_change,
  };

  return (
    <DataContext.Provider
      value={{
        filters,
        setFilters,
        currentData,
        monthlyComparison,
        isLoading: false,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
