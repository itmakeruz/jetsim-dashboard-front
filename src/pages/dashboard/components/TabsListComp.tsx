import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";

function TabsListComp({ activeTab }) {
  return (
    <TabsList className="grid grid-cols-4 xl:col-span-1 lg:col-span-3 sm:col-span-2 bg-white border rounded h-[36px]">
      {["day", "week", "month", "quarter"].map((type) => (
        <TabsTrigger
          key={type}
          value={type}
          className={`text-sm text-main-black border border-gray-300 w-full font-normal   ${
            activeTab === type ? "bg-main-orange text-white" : "bg-white"
          }`}
        >
          {
            {
              day: "День",
              week: "Неделя",
              month: "Месяц",
              quarter: "Квартал",
            }[type]
          }
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

export default TabsListComp;
