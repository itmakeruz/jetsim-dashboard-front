import { NavLink } from "react-router-dom";
import getColorClasses from "../../utils/getColorClasses";

const SidebarItem = ({ icon: Icon, label, path }) => {
  const baseStyle =
    "flex items-center justify-between gap-[10px] p-[14px_20px] pr-[15px] font-medium text-[14px]";
  const activeStyle = "bg-white text-main-orange";
  const inactiveStyle = "text-main-black hover:bg-gray-100";
  return (
    <NavLink
      to={path}
      end={path === "/" || path === "/promocodes"}
      className={({ isActive }) => {
        return `${isActive ? activeStyle : inactiveStyle} ${baseStyle}`;
      }}
    >
      {({ isActive }) => (
        <>
          <div className="flex gap-2 items-center">
            <Icon
              className={`w-5 h-5 shrink-0 ${
                isActive ? "text-main-orange" : "text-main-black"
              }`}
            />
            <span>{label}</span>
          </div>
          {/* {count > 0 && (
            <span
              className={`text-[14px] leading-[1] font-medium min-w-[34px] shrink-0 flex items-center justify-center px-[5px] min-h-[24px] rounded-[4px] ${getColorClasses(
                keyWord
              )}`}
            >
              {count}
            </span>
          )} */}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
