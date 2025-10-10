import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

export default function AdminLayout() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <Header setOpenMenu={setOpenMenu} />
      <div className="flex">
        <Sidebar openMenu={openMenu} />
        <main className="h-[calc(100vh-48px)] relative bg-[#F5F6F8] w-full overflow-y-auto p-[16px_20px]">
          <Outlet />
        </main>
      </div>
    </>
  );
}
