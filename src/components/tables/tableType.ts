import { Meta } from "@/types/commonTypes";

export type FilterType =
  | "input"
  | "select"
  | "date"
  | { type: "select"; options: { value: string; label: string }[] }
  | { type: "dateRange"; startKey: string; endKey: string };

export type Column<T = any> = {
  id: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  filter?: FilterType;
  filterKey?: string;
  width?: number;
};

export type CustomTableProps<T = any> = {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  skeletonCount?: number;
  hasPagination?: boolean;
  pagination?: Meta;
  defaultPageSize?: number;
  viewPath?: string; // Masalan: "/orders/view" yoki "/users/drivers/view"
  onRowClick?: (row: T) => void; // Qatorni bosganda
  /** Excel yuklash tugmasi ko‘rinsin (masalan Transactions sahifasida) */
  showExcelButton?: boolean;
  /** Excel tugmasi bosilganda (API so‘rovi keyinroq ulanganadi) */
  onExcelExport?: () => void;
  /** To‘liq ekran tugmasi ko‘rinsin */
  showFullscreenButton?: boolean;
  /** Filtr boshlanish sanasi (toolbar ichida ko‘rsatiladi) */
  startDate?: string;
  /** Filtr tugash sanasi (toolbar ichida ko‘rsatiladi) */
  endDate?: string;
  /** Sana filtr inputlari va tozalash (toolbar ichida) */
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  onClearDateFilter?: () => void;
};
