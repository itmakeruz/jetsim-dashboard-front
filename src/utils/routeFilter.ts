import { hasRole } from "./sidebarFilter";

// Function to check if a route is accessible for a specific user role
export const isRouteAccessible = (path, user) => {
  if (!user) return true; // If no user, allow access (will be handled by ProtectedRoute)

  const isTuragent = hasRole(user, "Turagent");
  const isManager = hasRole(user, "manager");

  if (!isTuragent && !isManager) return true; // If not Turagent, allow all routes

  // For Turagent role, block specific routes
  const blockedRoutesForTuragent = [
    "/contractors",
    // "/reports",
    "/branches",
    "/warehouse",
    "/reference-tables",
    "/site",
    "/settings",
    "/product-orders",
    "/quick-order",
  ];
  // For Turagent role, block specific routes
  const blockedRoutesForManager = [
    "/contractors",
    "/branches",
    "/warehouse",
    "/reference-tables",
    "/site",
    "/settings",
    "/quick-order",
  ];

  if (isTuragent) {
    // Check if the current path matches any blocked route
    const isBlocked = blockedRoutesForTuragent.some(
      (blockedRoute) =>
        !path.startsWith(`/reference-tables/clients/`) &&
        path.startsWith(blockedRoute)
    );

    return !isBlocked;
  }

  if (isManager) {
    // Check if the current path matches any blocked route
    const isBlocked = blockedRoutesForManager.some((blockedRoute) =>
      path.startsWith(blockedRoute)
    );

    return !isBlocked;
  }
};

// Function to filter routes based on user role
export const filterRoutesByRole = (routes, user) => {
  if (!user) return routes;

  const isTuragent = hasRole(user, "Turagent");

  if (!isTuragent) return routes;

  // For Turagent role, filter out blocked routes
  return routes.filter((route) => {
    // Check main route
    if (!isRouteAccessible(route.path, user)) {
      return false;
    }

    // Check children routes
    if (route.children) {
      route.children = route.children.filter((child) =>
        isRouteAccessible(child.path, user)
      );
      // Only show parent if it has visible children
      return route.children.length > 0;
    }

    return true;
  });
};
