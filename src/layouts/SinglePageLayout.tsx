import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";

function SinglePageLayout() {
  return (
    <>
      <Header />
      <div className="flex">
        <main className="h-[calc(100vh-48px)] bg-[#F5F6F8] w-full overflow-y-auto p-[16px_20px]">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default SinglePageLayout;
