import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";
const getInitialRange = (tab) => {
  const now = new Date();
  switch (tab) {
    case "day":
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };
    case "week":
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "month":
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
    case "quarter":
      return {
        startDate: startOfQuarter(now),
        endDate: endOfQuarter(now),
      };
    default:
      return { startDate: now, endDate: now };
  }
};
export default getInitialRange;
