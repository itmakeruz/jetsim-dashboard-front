// Function to check if user has specific role
export const hasRole = (user, roleName) => {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.name === roleName);
};

// Function to filter sidebar items based on user role
export const filterSidebarByRole = (sidebarItems, user) => {
  if (!user) return sidebarItems;

  const isTuragent = hasRole(user, "Turagent");
  const isManager = hasRole(user, "manager");

  if (!isTuragent && !isManager) return sidebarItems;

  // For Turagent role, hide specific items based on exact labels from sidebar
  const hiddenForTuragent = [
    "Справочные таблицы",
    "Склад",
    "Сайт",
    "Настройки",
    "Филиалы",
    "Контрагенты",
    // "Отчеты",
    "Заказать товар",
  ];
  // For Manager role, hide specific items based on exact labels from sidebar
  const hiddenForManager = [
    "Справочные таблицы",
    "Склад",
    "Сайт",
    "Настройки",
    "Филиалы",
    "Контрагенты",
  ];

  return sidebarItems.filter((item) => {
    // Check main item
    if (isTuragent) {
      if (hiddenForTuragent.includes(item.label)) {
        return false;
      }

      // Check children items
      if (item.children) {
        item.children = item.children.filter(
          (child) => !hiddenForTuragent.includes(child.label)
        );
        // Only show parent if it has visible children
        return item.children.length > 0;
      }
    }

    if (isManager) {
      if (hiddenForManager.includes(item.label)) {
        return false;
      }

      // Check children items
      if (item.children) {
        item.children = item.children.filter(
          (child) => !hiddenForManager.includes(child.label)
        );
        // Only show parent if it has visible children
        return item.children.length > 0;
      }
    }

    return true;
  });
};
