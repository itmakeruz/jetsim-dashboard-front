import Dashboard from "../pages/dashboard";

// Справочные таблицы
import ReferenceLayout from "./../pages/reference/index";
import Tariffs from "../pages/reference/tariffs";
import Regions from "../pages/reference/regions";
import RegionGroups from "../pages/reference/regionGroups";
import TariffsTypes from "../pages/reference/tariffsTypes";

// Заказы
import Orders from "../pages/orders/index";

// Сайт
import SiteLayout from "../pages/site/index";
import News from "../pages/site/news";
import FAQ from "../pages/site/faq";
import NewsSingle from "@/pages/site/news/pages/NewsSingle";
import FaqSingle from "@/pages/site/faq/pages/FaqSingle";

// Настройки
import Transactions from "../pages/settings/transactions";

// Partners and Users
import Partners from "../pages/partners";
import Users from "../pages/users";
import UserSingle from "../pages/users/pages/UserSingle";
import Employees from "../pages/employees";
import Promocodes from "../pages/promocodes";
import PromocodeSettings from "../pages/promocodes/settings";

// Support
import Operators from "../pages/support/operators";
import Categories from "../pages/support/categories";

const adminRoutes = [
  { path: "/", element: <Dashboard /> },

  { path: "/users", element: <Users /> },
  { path: "/users/view/:id", element: <UserSingle /> },
  { path: "/employees", element: <Employees /> },
  { path: "/partners", element: <Partners /> },
  { path: "/promocodes", element: <Promocodes /> },
  { path: "/promocodes/settings", element: <PromocodeSettings /> },

  // Справочные таблицы

  { path: "/tariffs", element: <Tariffs /> },
  { path: "/tariff-types", element: <TariffsTypes /> },
  { path: "regions", element: <Regions /> },
  { path: "region-groups", element: <RegionGroups /> },

  // Заказы
  { path: "/orders", element: <Orders /> },

  // Сайт
  {
    path: "/site",
    element: <SiteLayout />,
    children: [
      { path: "/site/news", element: <News /> },
      { path: "/site/news/:id", element: <NewsSingle /> },
      { path: "/site/faq", element: <FAQ /> },
      { path: "/site/faq/:id", element: <FaqSingle /> },
    ],
  },

  // Настройки
  { path: "/transactions", element: <Transactions /> },
  { path: "/support/operators", element: <Operators /> },
  { path: "/support/categories", element: <Categories /> },
];

export default adminRoutes;
