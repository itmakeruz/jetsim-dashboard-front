import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayouts";
import adminRoutes from "./adminRoutes";
import SinglePageLayout from "@/layouts/SinglePageLayout";
import LoginPage from "@/pages/login/LoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import Error404 from "@/components/Error404";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {adminRoutes.map(({ path, element, children }) => (
              <Route key={path} path={path} element={element}>
                {children &&
                  children.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
              </Route>
            ))}
          </Route>
          <Route path="/" element={<SinglePageLayout />}>
            <Route path="/user/:id" element={<h1>asd</h1>} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}
