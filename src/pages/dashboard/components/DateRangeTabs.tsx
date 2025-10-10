import {
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TabsListComp from "./TabsListComp";
import TabsController from "./TabsController";

const DateRangeTabs = ({ handleChange, activeTab, range, setRange }) => {
  const shiftRange = (direction) => {
    const stepFnMap = {
      day: direction === "next" ? addDays : subDays,
      week: direction === "next" ? addWeeks : subWeeks,
      month: direction === "next" ? addMonths : subMonths,
      quarter: direction === "next" ? addQuarters : subQuarters,
    };

    const step = stepFnMap[activeTab];

    setRange((prevRange) => {
      const updatedRange = {
        startDate: step(prevRange[0].startDate, 1),
        endDate: step(prevRange[0].endDate, 1),
        key: "selection",
      };

      handleChange?.({
        target: { name: "startDate", value: updatedRange.startDate },
      });
      handleChange?.({
        target: { name: "endDate", value: updatedRange.endDate },
      });

      return [updatedRange];
    });
  };

  return (
    <>
      <TabsController
        setRange={setRange}
        handleChange={handleChange}
        range={range}
        activeTab={activeTab}
        shiftRange={shiftRange}
      />
      <TabsListComp activeTab={activeTab} />
    </>
  );
};

export default DateRangeTabs;
