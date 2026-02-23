// Transaction status options
export const TRANSACTION_STATUS_OPTIONS = [
  { value: "CREATED", label: "Создано" },
  { value: "COMPLETED", label: "Завершено" },
  { value: "FAILED", label: "Неуспешно" },
  { value: "ERROR", label: "Ошибка" },
];
export const TRANSACTION_STATUS_CLASSES: Record<string, string> = {
  CREATED: "bg-yellow-100 text-yellow-700", // В ожидании
  COMPLETED: "bg-blue-100 text-blue-700", // Завершено
  FAILED: "bg-red-100 text-red-700", // Неуспешно
  ERROR: "bg-gray-100 text-gray-700", // Ошибка
};
