import { ChevronLeft, ChevronRight } from "lucide-react";
import { ru } from "date-fns/locale";
import { format } from "date-fns";
import { useState } from "react";
import { TabsContent } from "@radix-ui/react-tabs";
import { DateRange } from "react-date-range";

function TabsController({
  shiftRange,
  range,
  setRange,
  activeTab,
  handleChange,
}) {
  const [show, setShow] = useState(false);
  const formattedStart = format(range[0].startDate, "dd MMMM", { locale: ru });
  const formattedEnd = format(range[0].endDate, "dd MMMM", { locale: ru });

  const handleCloseModal = () => {
    setShow(false);
    // When modal closes, check if both dates are selected and trigger change
    if (range[0].startDate && range[0].endDate) {
      handleChange?.({
        startDate: range[0].startDate,
        endDate: range[0].endDate,
      });
    }
  };

  return (
    <div className="flex xl:col-span-1 lg:col-span-3 relative bg-white border border-gray-300 items-center rounded justify-between grow whitespace-nowrap">
      <button
        onClick={() => shiftRange("prev")}
        className="border border-gray-300 w-[38px] flex items-center justify-center h-[36px] rounded bg-white text-main-black"
      >
        <ChevronLeft />
      </button>
      <div
        onClick={() => {
          setShow(true);
        }}
        className="text-sm px-2 self-stretch flex items-center cursor-pointer font-normal text-main-black"
      >
        {formattedStart} – {formattedEnd}
      </div>
      <button
        id="btn"
        onClick={() => shiftRange("next")}
        className="border border-gray-300 w-[38px] flex items-center justify-center h-[36px] rounded bg-white text-main-black"
      >
        <ChevronRight />
      </button>
      {show && (
        <>
          <div onClick={handleCloseModal} className="fixed inset-0 z-[1]"></div>
          <TabsContent
            className="absolute z-[1] top-[120%] w-fit left-0"
            value={activeTab}
          >
            <DateRange
              locale={ru}
              onChange={(item) => {
                setRange([item.selection]);
                // Only update if both dates are selected
                if (item.selection.startDate && item.selection.endDate) {
                  handleChange?.({
                    startDate: item.selection.startDate,
                    endDate: item.selection.endDate,
                  });
                }
              }}
              moveRangeOnFirstSelection={false}
              ranges={range}
              className="rounded-lg w-full border shadow"
            />
          </TabsContent>
        </>
      )}
    </div>
  );
}

export default TabsController;
