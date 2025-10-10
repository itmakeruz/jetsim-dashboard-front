import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Wallet } from "lucide-react";
import adminMenu from "../../constants/sidebar";
import { getActiveLabel } from "./header.utils";
import HeaderLeft from "./HeaderLeft";
import ProfileDropdown from "./ProfileDropDown";
import CustomSelect from "../formElements/CustomSelect";
import { useEffect, useState } from "react";
import selectConfigs from "@/constants/headerOptions";
import { useAuthStore } from "@/store/authStore";
import Loader from "../Loader";
import formatNumber from "@/utils/formatNumber";
import { usersAPI } from "@/lib/api";
import { showToast } from "@/utils/toastHelper";

function Header({ setOpenMenu }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [data, setData] = useState(null);
  const [isChangingBranch, setIsChangingBranch] = useState(false);
  const { id } = useParams();
  const {
    user,
    isLoading,
    branch_id,
    setSelectedWarehouse,
    updateUserBranches,
  } = useAuthStore();

  const activeLabel = getActiveLabel(adminMenu, pathname);

  const handleBranchChange = async (e) => {
    const { name, value } = e.target;

    // If user has branches and this is a different branch, update primary branch
    if (user?.branches && user.branches.length > 0 && value !== branch_id) {
      setIsChangingBranch(true);
      try {
        await usersAPI.manageUserBranches(user.id, {
          action: "set_primary",
          primary_branch_id: value,
        });

        setSelectedWarehouse(value);
        // Update the user's branches to reflect the new primary branch
        const updatedBranches = user.branches.map((branch) => ({
          ...branch,
          pivot: {
            ...branch.pivot,
            is_primary: branch.id.toString() === value ? 1 : 0,
          },
        }));
        updateUserBranches(updatedBranches);

        // Show success message
        const selectedBranch = user.branches.find(
          (branch) => branch.id.toString() === value
        );
        showToast.success(`Primary branch changed to ${selectedBranch?.name}`);
      } catch (error) {
        console.error("Failed to update primary branch:", error);
        showToast.error("Failed to update primary branch. Please try again.");
      } finally {
        setIsChangingBranch(false);
      }
    }
  };

  const currentOptions = selectConfigs[pathname] || [];
  const excludeHeaderLeftPages = ["/reports/"];

  const shouldHideHeaderLeft = excludeHeaderLeftPages.some((path) =>
    pathname.startsWith(path)
  );
  let selectedPath = pathname.split("/").filter((item) => item)[0];

  useEffect(() => {
    if (shouldHideHeaderLeft) {
      // For reports pages, use hardcoded data instead of localStorage
      if (selectedPath === "reports") {
        const reportsData = [
          {
            id: "products",
            name: "Отчет по продажам товаров",
          },
          {
            id: "sim-cards",
            name: "Отчет по продажам сим-карт",
          },
        ];
        const currentItem = reportsData.find((item) => item.id === id);
        if (!currentItem) {
          // alert("Not Found");
          // navigate(`/${selectedPath}`);
        } else {
          setData(currentItem);
        }
      } else {
        // For other pages, use localStorage as before
        const storedData = JSON.parse(localStorage.getItem(selectedPath)) || [];
        const currentItem = storedData.find((item) => item.id === parseInt(id));
        if (!currentItem) {
          alert("Not Found");
          navigate(`/${selectedPath}`);
        } else {
          setData(currentItem);
        }
      }
    }
  }, []);

  // Get branch options from user's branches
  const getBranchOptions = () => {
    if (user?.branches && user.branches.length > 0) {
      return user.branches.map((branch) => ({
        id: branch.id,
        name: branch.name,
        isPrimary: branch.pivot?.is_primary === 1,
      }));
    }
    return currentOptions;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-[48px] w-full flex items-center top-0 py-[10px] bg-white main-shadow z-[1] relative">
      {!shouldHideHeaderLeft ? (
        <HeaderLeft onToggleMenu={() => setOpenMenu((prev) => !prev)} />
      ) : (
        <Link
          to={`/${selectedPath}`}
          className="text-main-black pl-4 flex items-center gap-4 whitespace-nowrap font-bold text-base"
        >
          <ChevronLeft />
          {data?.name}
        </Link>
      )}
      <div className="px-[24px] w-full flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-main-black text-base font-bold leading-[1]">
            {activeLabel && <span>{activeLabel}</span>}
          </h1>
          {getBranchOptions().length > 0 && (
            <div className="flex items-center gap-2">
              <CustomSelect
                value={branch_id}
                name={"branch"}
                options={getBranchOptions().map((branch) => ({
                  ...branch,
                  name: branch.isPrimary
                    ? `${branch.name} (Primary)`
                    : branch.name,
                }))}
                placeholder="Выберите филиал"
                onChange={handleBranchChange}
                disabled={isChangingBranch}
              />
              {isChangingBranch && (
                <div className="w-4 h-4">
                  <span className="loader w-4 h-4 border-2"></span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-[30px]">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
