import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react"; // yoki boshqa icon kutubxonasi
import SidebarItem from "./SidebarItem";
import { useLocation } from "react-router-dom";

export default function SidebarDropdown({ icon: Icon, title, items }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const isMatch = items.some((item) => location.pathname.includes(item.path));
    if (isMatch) {
      setOpen(true);
    }
  }, [location.pathname, items]);

  const orderCounts = {
    new: 5,
    pendingCancel: 15,
    cancelled: 154,
    active: 1000,
  };
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-main-black hover:bg-gray-100 rounded p-[16px_20px] pr-[15px] font-medium text-[14px]"
      >
        <div className="flex items-center text-start gap-[10px]">
          <Icon className="w-5 h-5 shrink-0" />
          <span>{title}</span>
        </div>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {open && (
        <ul className="pl-[10px]">
          {items.map((item) => (
            <SidebarItem
              count={orderCounts[item.key] || 0}
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              keyWord={item.key}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
