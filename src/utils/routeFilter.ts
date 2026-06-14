const FULL_ACCESS_ROLES = ["SUPER_ADMIN", "ADMIN"];

const ROLE_ALLOWED_PATHS = {
  AGENT: ["/promocodes"],
  ACCOUNTANT: ["/"],
  PRE_ACCOUNTANT: ["/"],
};

const getUserRole = (user) => user?.role || "";

export const getDefaultRouteByRole = (user) => {
  const role = getUserRole(user);
  if (role === "AGENT") return "/promocodes";

  return "/";
};

const isPathAllowed = (path, allowedPaths) =>
  allowedPaths.some((allowedPath) => {
    if (allowedPath === "/") return path === "/";
    if (allowedPath.endsWith("/*")) {
      const basePath = allowedPath.slice(0, -2);
      return path === basePath || path.startsWith(`${basePath}/`);
    }
    return path === allowedPath;
  });

// Function to check if a route is accessible for a specific user role
export const isRouteAccessible = (path, user) => {
  if (!user) return true; // ProtectedRoute handles unauthenticated users.

  const role = getUserRole(user);
  if (FULL_ACCESS_ROLES.includes(role)) return true;

  const allowedPaths = ROLE_ALLOWED_PATHS[role] || ["/"];

  return isPathAllowed(path, allowedPaths);
};

// Function to filter routes based on user role
export const filterRoutesByRole = (routes, user) => {
  if (!user) return routes;

  const role = getUserRole(user);
  if (FULL_ACCESS_ROLES.includes(role)) return routes;

  return routes.filter((route) => {
    if (!isRouteAccessible(route.path, user)) {
      return false;
    }

    if (route.children) {
      const children = route.children.filter((child) =>
        isRouteAccessible(child.path, user)
      );
      return children.length > 0;
    }

    return true;
  }).map((route) => {
    if (!route.children) return route;

    return {
      ...route,
      children: route.children.filter((child) =>
        isRouteAccessible(child.path, user)
      ),
    };
  });
};
