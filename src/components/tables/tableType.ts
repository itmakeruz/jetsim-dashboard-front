import { Meta } from "@/types/commonTypes";

export type FilterType =
  | "input"
  | "select"
  | "date"
  | { type: "select"; options: { value: string; label: string }[] };

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
};
