import { hasRole } from "@/utils/sidebarFilter";
import Filters from "./components/Filters";
import SalesChart from "./components/SalesChart";
import StatsCards from "./components/StatsCards";
import TopProducts from "./components/TopProducts";
import { DataProvider, useDataContext } from "@/context/DataContext";
import { useAuthStore } from "@/store/authStore";
import Loader from "@/components/Loader";

const DashboardContent = () => {
  const { isLoading } = useDataContext();
  // const { user } = useAuthStore();

  if (isLoading) {
    return <Loader isFullScreen={false} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Filters />
      <StatsCards />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        <SalesChart />
        <TopProducts />
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
};

export default Dashboard;
