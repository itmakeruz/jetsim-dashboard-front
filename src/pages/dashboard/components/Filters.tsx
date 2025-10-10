import CustomSelect from "@/components/formElements/CustomSelect";
import { useState, useMemo } from "react";
import DateRangeTabs from "./DateRangeTabs";
import { Tabs } from "@radix-ui/react-tabs";
import getInitialRange from "@/utils/getInitialRange";
import { useDataContext } from "@/context/DataContext";
import { useApi } from "@/hooks/useApi";

const Filters = () => {
  const { filters, setFilters } = useDataContext();
  // Fetch real options
  const { data: branchesData, isLoading: branchesLoading } = useApi({
    endpoint: "/branches",
    method: "GET",
  });
  const { data: usersData, isLoading: usersLoading } = useApi({
    endpoint: "/users",
    method: "GET",
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useApi({
    endpoint: "/product-groups",
    method: "GET",
  });

  // Map API data to options
  const branchOptions = [
    { id: "all", name: "Barchasi" },
    ...(branchesData?.data?.map((b) => ({ id: b.id, name: b.name })) || []),
  ];
  const userOptions =
    usersData?.data?.map((u) => ({ id: u.id, name: u.name })) || [];
  const categoryOptions = [
    { id: "all", name: "Barchasi" },
    ...(categoriesData?.data?.map((c) => ({ id: c.id, name: c.name })) || []),
  ];

  // Make activeTab and range stateful
  const [activeTab, setActiveTab] = useState("week");
  const [range, setRange] = useState([
    {
      ...getInitialRange("week"),
      key: "selection",
    },
  ]);

  // When activeTab changes, update range accordingly
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const updatedRange = {
      ...getInitialRange(tab),
      key: "selection",
    };
    setRange([updatedRange]);
    // Update filters with new dates
    setFilters((prev) => ({
      ...prev,
      date_from: updatedRange.startDate
        ? updatedRange.startDate.toISOString().slice(0, 10)
        : null,
      date_to: updatedRange.endDate
        ? updatedRange.endDate.toISOString().slice(0, 10)
        : null,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      if (value === "all") {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      }
      // group_id, branch_id, user_id should be numbers
      if (["group_id", "branch_id", "user_id"].includes(name)) {
        return { ...prev, [name]: Number(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  // Date range change handler
  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({
      ...prev,
      date_from: startDate ? startDate.toISOString().slice(0, 10) : null,
      date_to: endDate ? endDate.toISOString().slice(0, 10) : null,
    }));
  };

  // Show loading if any select is loading
  if (branchesLoading || usersLoading || categoriesLoading) {
    return <div className="p-4">Loading filters...</div>;
  }

  return (
    <Tabs
      className="grid xl:grid-cols-[.5fr_.5fr_.5fr_1fr_1fr] w-full lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] sm:grid-cols-2 items-center xl:gap-4 lg:gap-3 gap-2"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <CustomSelect
        value={filters.group_id || "all"}
        name={"group_id"}
        options={categoryOptions}
        placeholder="Группа товаров"
        onChange={handleChange}
        divClassname={"lg:col-span-2 xl:col-span-1"}
        className="border !border-gray-300 bg-white rounded w-full"
      />
      <CustomSelect
        value={filters.branch_id || "all"}
        name={"branch_id"}
        options={branchOptions}
        placeholder="Филиал"
        divClassname={"lg:col-span-2 xl:col-span-1"}
        onChange={handleChange}
        className="border !border-gray-300  bg-white rounded w-full"
      />
      <CustomSelect
        value={filters.user_id || userOptions[0]?.id?.toString() || ""}
        name={"user_id"}
        options={userOptions}
        placeholder="Кассир"
        divClassname={"lg:col-span-2 xl:col-span-1"}
        onChange={handleChange}
        className="border !border-gray-300 bg-white rounded w-full"
      />
      <DateRangeTabs
        setRange={setRange}
        range={range}
        activeTab={activeTab}
        handleChange={handleDateChange}
      />
    </Tabs>
  );
};

export default Filters;
