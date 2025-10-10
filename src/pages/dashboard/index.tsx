import { hasRole } from "@/utils/sidebarFilter";
import Filters from "./components/Filters";
import SalesChart from "./components/SalesChart";
import StatsCards from "./components/StatsCards";
import TopProducts from "./components/TopProducts";
import { DataProvider, useDataContext } from "@/context/DataContext";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  // const { user } = useAuthStore();

  return (
    <DataProvider>
      <div className="flex flex-col gap-4">
        {/* {!hasRole(user, "Turagent") && !hasRole(user, "manager") && <Filters />} */}
        {/* <StatsCards /> */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {/* <SalesChart /> */}
          {/* <TopProducts /> */}
        </div>
      </div>
    </DataProvider>
  );
};

export default Dashboard;
