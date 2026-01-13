import { useDataContext } from "@/context/DataContext";
import StatCard from "./StatCard";

function StatsCards() {
  const { currentData } = useDataContext();
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
      {currentData.stats.map((data) => {
        return <StatCard {...data} key={data.id} />;
      })}
    </div>
  );
}

export default StatsCards;
