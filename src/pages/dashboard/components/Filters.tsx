import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { subDays, endOfDay } from "date-fns";
import DateRangeTabs from "./DateRangeTabs";
import { Tabs } from "@radix-ui/react-tabs";
import getInitialRange from "@/utils/getInitialRange";
import { useDataContext } from "@/context/DataContext";

const Filters = () => {
  const { setFilters } = useDataContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or defaults
  const urlTab = searchParams.get("tab");
  const urlDateFrom = searchParams.get("date_from");
  const urlDateTo = searchParams.get("date_to");

  // Check if this is first load (no URL params)
  const isFirstLoad = !urlTab && !urlDateFrom && !urlDateTo;

  // Initialize state from URL or default to week
  const [activeTab, setActiveTab] = useState(urlTab || "week");
  const [range, setRange] = useState(() => {
    if (urlDateFrom && urlDateTo) {
      return [
        {
          startDate: new Date(urlDateFrom),
          endDate: new Date(urlDateTo),
          key: "selection",
        },
      ];
    }
    // If first load, use last 7 days up to today
    if (isFirstLoad) {
      const today = endOfDay(new Date());
      const weekAgo = subDays(today, 6); // 7 days including today
      return [
        {
          startDate: weekAgo,
          endDate: today,
          key: "selection",
        },
      ];
    }
    return [
      {
        ...getInitialRange(urlTab || "week"),
        key: "selection",
      },
    ];
  });

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const updatedRange = {
      ...getInitialRange(tab),
      key: "selection",
    };
    setRange([updatedRange]);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    // Clear dates when tab changes
    params.delete("date_from");
    params.delete("date_to");
    setSearchParams(params, { replace: true });

    // Set filters with new range dates and send request
    setFilters({
      date_from: updatedRange.startDate.toISOString(),
      date_to: updatedRange.endDate.toISOString(),
    });
  };

  // Date range change handler - only called when both dates are fully selected
  const handleDateChange = ({ startDate, endDate }) => {
    // Only proceed if both dates are provided and different
    if (!startDate || !endDate || startDate.getTime() === endDate.getTime()) {
      return;
    }

    const newRange = [
      {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
      },
    ];
    setRange(newRange);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("date_from", startDate.toISOString());
    params.set("date_to", endDate.toISOString());
    setSearchParams(params, { replace: true });

    // Update filters and send request
    setFilters({
      date_from: startDate.toISOString(),
      date_to: endDate.toISOString(),
    });
  };

  // Initialize filters on mount
  useEffect(() => {
    // Check if this is first load (no URL params)
    const isFirstLoadCheck = !urlTab && !urlDateFrom && !urlDateTo;

    if (urlDateFrom && urlDateTo) {
      // If URL has dates, use them
      setFilters({
        date_from: urlDateFrom,
        date_to: urlDateTo,
      });
    } else if (isFirstLoadCheck) {
      // If first load, set filters with last 7 days
      const today = endOfDay(new Date());
      const weekAgo = subDays(today, 6);
      setFilters({
        date_from: weekAgo.toISOString(),
        date_to: today.toISOString(),
      });
      // Update URL
      const params = new URLSearchParams();
      params.set("tab", "week");
      params.set("date_from", weekAgo.toISOString());
      params.set("date_to", today.toISOString());
      setSearchParams(params, { replace: true });
    } else if (urlTab) {
      // If URL has tab but no dates, set filters with tab's initial range
      const initialRange = getInitialRange(urlTab);
      setFilters({
        date_from: initialRange.startDate.toISOString(),
        date_to: initialRange.endDate.toISOString(),
      });
    }
  }, []);

  return (
    <Tabs
      className="w-full grid grid-cols-2"
      value={activeTab}
      onValueChange={handleTabChange}
    >
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
