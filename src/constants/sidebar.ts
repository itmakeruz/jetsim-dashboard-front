import {
  House,
  Users,
  Building2,
  Globe,
  ClipboardList,
  List,
  CircleHelp,
  Newspaper,
  UserCog,
  Headset,
  FolderOpen,
  Users2,
  IdCardIcon,
  Settings,
  TicketPercent,
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
    path: "/employees",
    label: "Сотрудники",
    icon: IdCardIcon,
  },
  {
    label: "Транзакции",
    path: "/transactions",
    icon: FaMoneyBillTransfer,
  },
  {
    label: "Регионы",
    icon: Building2,
    children: [
      {
        path: "/regions",
        label: "Регионы",
        icon: Building2,
      },
      {
        path: "/region-groups",
        label: "Регион группы",
        icon: Globe,
      },
    ],
  },
  {
    label: "Тарифы",
    icon: ClipboardList,
    path: "/tariffs",
  },
  {
    path: "/orders",
    label: "Заказы",
    icon: List,
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
    label: "Служба поддержки",
    icon: Headset,
    children: [
      {
        path: "/support/operators",
        label: "Операторы",
        icon: Users2,
      },
      {
        path: "/support/categories",
        label: "Категории",
        icon: FolderOpen,
      },
    ],
  },
  {
    path: "/partners",
    label: "Партнеры",
    icon: UserCog,
  },
  {
    label: "Промокоды",
    icon: TicketPercent,
    children: [
      {
        path: "/promocodes",
        label: "Промокоды",
        icon: TicketPercent,
      },
      {
        path: "/promocodes/settings",
        label: "Настройки",
        icon: Settings,
      },
    ],
  },
];

export default adminMenu;
