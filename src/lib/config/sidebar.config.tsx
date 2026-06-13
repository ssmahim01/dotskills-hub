import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Package,
  FolderTree,
  ShoppingCart,
  UserRound,
  Settings,
  Box,
} from "lucide-react";

export const sidebarConfig = {
  ADMIN: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Subscriptions",
      href: "/dashboard/subscriptions",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Plans",
      href: "/dashboard/plans",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Stores",
      href: "/dashboard/stores",
      icon: <Store className="w-5 h-5" />,
    },
    {
      label: "Users",
      href: "/dashboard/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ],

  OWNER: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },

    {
      label: "Products",
      href: "/dashboard/products",
      icon: <Package className="w-5 h-5" />,
    },

    {
      label: "Categories",
      href: "/dashboard/categories",
      icon: <FolderTree className="w-5 h-5" />,
    },

    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      label: "POS",
      href: "/dashboard/pos",
      icon: <Box className="w-5 h-5" />,
    },

    {
      label: "Customers",
      href: "/dashboard/customers",
      icon: <UserRound className="w-5 h-5" />,
    },

    // {
    //   label: "Store Settings",
    //   href: "/dashboard/store",
    //   icon: <Store className="w-5 h-5" />,
    // },

    // {
    //   label: "Settings",
    //   href: "/dashboard/settings",
    //   icon: <Settings className="w-5 h-5" />,
    // },
  ],
};
