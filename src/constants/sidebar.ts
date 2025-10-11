import {
  House,
  Users,
  Building2,
  Globe,
  ClipboardList,
  List,
  Check,
  X,
  Settings,
  CircleHelp,
  Newspaper,
  UserCog,
} from "lucide-react";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const adminMenu = [
  { path: "/", label: "Главная", icon: House },
  {
    path: "/users",
    label: "Пользователи",
    icon: Users,
  },
  {
    label: "Транзакции",
    path: "/settings/transactions",
    icon: FaMoneyBillTransfer,
  },
  {
    label: "Регионы",
    icon: Building2,
    children: [
      {
        path: "/reference-tables/region-groups",
        label: "Регион группы",
        icon: Globe,
      },
      {
        path: "/reference-tables/regions",
        label: "Регионы",
        icon: Building2,
      },
    ],
  },
  {
    path: "/reference-tables/tariffs",
    label: "Тарифы",
    icon: ClipboardList,
  },
  {
    label: "Заказы",
    icon: List,
    children: [
      { path: "/orders/active", label: "Активные заказы", icon: Check },
      { path: "/orders/cancelled", label: "Отмененные", icon: X },
    ],
  },
  {
    label: "Сайт",
    icon: Globe,
    children: [
      { path: "/site/news", label: "Новости", icon: Newspaper },
      { path: "/site/faq", label: "FAQ", icon: CircleHelp },
    ],
  },
  {
    label: "Настройки",
    icon: Settings,
    children: [
      {
        path: "/partners",
        label: "Партнеры",
        icon: UserCog,
      },
    ],
  },
];

export default adminMenu;
