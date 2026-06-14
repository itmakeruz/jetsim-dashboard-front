import { isRouteAccessible } from "./routeFilter";

export const getUserRole = (user) => user?.role || "";

export const hasRole = (user, roleName) => getUserRole(user) === roleName;

export const filterSidebarByRole = (sidebarItems, user) => {
  if (!user) return sidebarItems;

  return sidebarItems
    .map((item) => {
      if (item.children) {
        const children = item.children.filter((child) =>
          isRouteAccessible(child.path, user)
        );

        return children.length > 0 ? { ...item, children } : null;
      }

      return isRouteAccessible(item.path, user) ? item : null;
    })
    .filter(Boolean);
};
