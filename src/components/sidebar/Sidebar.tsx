import sidebar from "../../constants/sidebar";
import SidebarDropdown from "./SidebarDropdown";
import SidebarItem from "./SidebarItem";
import { filterSidebarByRole } from "../../utils/sidebarFilter";
import { useAuthStore } from "../../store/authStore";

export default function Sidebar({ openMenu }) {
  const { user } = useAuthStore();

  // Filter sidebar items based on user role
  const filteredSidebar = filterSidebarByRole(sidebar, user);

  return (
    <aside
      className={`shadow h-[calc(100vh-48px)] no-scroll max-w-[230px] w-full shrink-0 overflow-y-auto ${
        openMenu ? "hidden" : ""
      }`}
    >
      <nav className="py-1">
        {filteredSidebar.map((item) =>
          item.children ? (
            <SidebarDropdown
              icon={item.icon}
              key={item.label}
              title={item.label}
              items={item.children}
            />
          ) : (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
            />
          )
        )}
      </nav>
    </aside>
  );
}
