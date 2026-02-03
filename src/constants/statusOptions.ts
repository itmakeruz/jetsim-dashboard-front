// Transaction status options
export const TRANSACTION_STATUS_OPTIONS = [
  { value: "PENDING", label: "В ожидании" },
  { value: "SUCCESS", label: "Успешно" },
  { value: "FAILED", label: "Неуспешно" },
];
export const TRANSACTION_STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", // В ожидании
  SUCCESS: "bg-green-100 text-green-700", // Успешно
  FAILED: "bg-red-100 text-red-700", // Неуспешно
};
