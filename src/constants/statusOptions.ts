// Transaction status options
export const ORDER_STATUS_OPTIONS = [
  { value: "CREATED", label: "Создано" },
  { value: "COMPLETED", label: "Завершено" },
  { value: "FAILED", label: "Неуспешно" },
  { value: "ERROR", label: "Ошибка" },
];
export const ORDER_STATUS_CLASSES: Record<string, string> = {
  CREATED: "bg-yellow-100 text-yellow-700", // В ожидании
  COMPLETED: "bg-blue-100 text-blue-700", // Завершено
  FAILED: "bg-red-100 text-red-700", // Неуспешно
  ERROR: "bg-gray-100 text-gray-700", // Ошибка
};
// Transaction status options
export const TRANSACTION_STATUS_OPTIONS = [
  { value: "PENDING", label: "Создано" },
  { value: "SUCCESS", label: "Завершено" },
  { value: "FAILED", label: "Неуспешно" },
  { value: "ERROR", label: "Ошибка" },
];
export const TRANSACTION_STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700", // В ожидании
  SUCCESS: "bg-blue-100 text-blue-700", // Завершено
  FAILED: "bg-red-100 text-red-700", // Неуспешно
  ERROR: "bg-gray-100 text-gray-700", // Ошибка
};
// Статус активации eSIM (Prisma SimStatus). null в БД = профиль ещё не активировали
export const SIM_ACTIVATION_OPTIONS = [
  { value: "NOT_ACTIVATED", label: "Не активирована" },
  { value: "ACTIVATED", label: "Активирована" },
  { value: "EXPIRED", label: "Использована" },
];
export const SIM_ACTIVATION_CLASSES: Record<string, string> = {
  NOT_ACTIVATED: "bg-gray-100 text-gray-700",
  ACTIVATED: "bg-green-100 text-green-700",
  EXPIRED: "bg-orange-100 text-orange-700",
};

// Технический статус выдачи eSIM (Prisma OrderStatus — тот же enum, что у заказа)
export const SIM_ISSUE_OPTIONS = [
  { value: "CREATED", label: "Создана" },
  { value: "REDEEM_COUPON", label: "Купон погашен" },
  { value: "NOTIFY_COUPON", label: "Купон выдан" },
  { value: "PENDING", label: "В обработке" },
  { value: "COMPLETED", label: "Завершена" },
  { value: "FAILED", label: "Ошибка" },
];
export const SIM_ISSUE_CLASSES: Record<string, string> = {
  CREATED: "bg-yellow-100 text-yellow-700",
  REDEEM_COUPON: "bg-indigo-100 text-indigo-700",
  NOTIFY_COUPON: "bg-indigo-100 text-indigo-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  FAILED: "bg-red-100 text-red-700",
};

// Transaction status options
export const VERIFICATION_STATUS_OPTIONS = [
  { value: "true", label: "Да" },
  { value: "false", label: "Нет" },
];
export const VERIFICATION_STATUS_CLASSES: Record<string, string> = {
  true: "bg-blue-100 text-blue-700", // Да
  false: "bg-red-100 text-red-700", // Нет
};
