import Dashboard from "../pages/dashboard";

// Справочные таблицы
import ReferenceLayout from "./../pages/reference/index";
import Tariffs from "../pages/reference/tariffs";
import Regions from "../pages/reference/regions";
import RegionGroups from "../pages/reference/regionGroups";

// Заказы
import Orders from "../pages/orders/index";

// Сайт
import SiteLayout from "../pages/site/index";
import News from "../pages/site/news";
import FAQ from "../pages/site/faq";
import NewsSingle from "@/pages/site/news/pages/NewsSingle";
import FaqSingle from "@/pages/site/faq/pages/FaqSingle";

// Настройки
import SettingsLayout from "../pages/settings/index";
import Transactions from "../pages/settings/transactions";

// Partners and Users
import Partners from "../pages/partners";
import Users from "../pages/users";

const adminRoutes = [
  { path: "/", element: <Dashboard /> },

  { path: "/users", element: <Users /> },
  { path: "/partners", element: <Partners /> },

  // Справочные таблицы
  {
    path: "/reference-tables",
    element: <ReferenceLayout />,
    children: [
      { path: "tariffs", element: <Tariffs /> },
      { path: "regions", element: <Regions /> },
      { path: "region-groups", element: <RegionGroups /> },
    ],
  },

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
  {
    path: "/settings",
    element: <SettingsLayout />,
    children: [{ path: "/settings/transactions", element: <Transactions /> }],
  },
];

export default adminRoutes;
