import {
  House,
  Users,
  Building2,
  Globe,
  ClipboardList,
  List,
  Settings,
  CircleHelp,
  Newspaper,
  UserCog,
  MessageCircle,
  Headset,
  FolderOpen,
  Users2,
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
    children: [
      {
        path: "/tariffs",
        label: "Тарифы",
        icon: ClipboardList,
      },
      {
        path: "/tariff-types",
        label: "Типы тарифов",
        icon: List,
      },
    ],
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
];

export default adminMenu;
