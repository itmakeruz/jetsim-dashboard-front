import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Lock, LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function ProfileDropdown() {
  const { logout, getProfile, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, [user, getProfile]);

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex select-none items-center gap-[10px] outline-none">
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.avatar || ""} alt="Avatar" />
          <AvatarFallback>
            {getUserInitials(user?.full_name || user?.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-main-black font-medium">
          {user?.full_name || user?.name || "User"}
        </span>
        <ChevronDown className="w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-3 ml-[-30px] mt-2 space-y-1 main-shadow">
        <DropdownMenuItem className="p-0">
          <Link
            to={`/`}
            className="flex items-center gap-2 p-[6px_8px] w-full text-left hover:bg-blue-50"
          >
            <User className="w-4 h-4" />
            Мой профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            to={`/`}
            className="flex items-center gap-2 p-[6px_8px] w-full text-left hover:bg-blue-50"
          >
            <Lock className="w-4 h-4" />
            Блокировать
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0" onClick={handleLogout}>
          <button className="flex items-center gap-2 p-[6px_8px] w-full text-left hover:bg-blue-50">
            <LogOut className="w-4 h-4" />
            {isLoading ? "Выход..." : "Выйти"}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
