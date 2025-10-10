import { useDataContext } from "@/context/DataContext";
import StatCard from "./StatCard";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { hasRole } from "@/utils/sidebarFilter";

function StatsCards() {
  const { currentData, setFilters } = useDataContext();
  const { user } = useAuthStore();
  useEffect(() => {
    if (hasRole(user, "Turagent") || hasRole(user, "manager")) {
      setFilters((prev) => ({ ...prev, user_id: user.id }));
    }
  }, [user]);
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
      {currentData.stats.map((data) => {
        return <StatCard {...data} key={data.id} />;
      })}
    </div>
  );
}

export default StatsCards;
