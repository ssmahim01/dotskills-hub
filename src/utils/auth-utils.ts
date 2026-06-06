// export type UserRole = "ADMIN" | "EDITOR";
export type UserRole =
  | "ADMIN"
  | "OWNER" 
  | "CUSTOMER";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};


export const customerRoutes: RouteConfig = {
  exact: ["/dashboard"],
  patterns: [/^\/dashboard/],
};

export const adminRoutes: RouteConfig = {
  exact: ["/dashboard/admin"],
  patterns: [/^\/dashboard\/admin/],
};

export const userRoutes: RouteConfig = {
  exact: ["/dashboard"],
  patterns: [/^\/dashboard/],
};

export const ownerRoutes: RouteConfig = {
  exact: ["/dashboard/owner"],
  patterns: [/^\/dashboard\/owner/],
};


export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) return true;
  return routes.patterns.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string
): UserRole | "USER" | null => {

  if (isRouteMatches(pathname, ownerRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, userRoutes)) {
    return "CUSTOMER";
  }

  return null;
};

export const isValidRouteForRole = (
  pathname: string,
  role: UserRole
): boolean => {
  // Public
  if (!pathname.startsWith("/customer")) {
    return true;
  }

  // Customer
  if (pathname.startsWith("/customer")) {
    return role === "CUSTOMER";
  }

  // Admin only
  if (pathname.startsWith("/dashboard/admin")) {
    return role === "ADMIN";
  }

  // Staff access
  if (pathname.startsWith("/dashboard")) {
    return ["ADMIN", "OWNER", "CUSTOMER"].includes(role);
  }

  return false;
};


export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "CUSTOMER":
      return "/dashboard";
    
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/";
  }
};
