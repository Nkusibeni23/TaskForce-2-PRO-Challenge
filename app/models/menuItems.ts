import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Receipt,
  Settings,
  Briefcase,
} from "lucide-react";

export interface MenuItem {
  icon: React.ComponentType<any>;
  text: string;
  category: string;
  path: string;
}

export const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, text: "Overview", category: "Menu", path: "/" },
  { icon: Wallet, text: "Accounts", category: "Menu", path: "/accounts" },
  { icon: PiggyBank, text: "Budget", category: "Menu", path: "/budget" },
  { icon: Briefcase, text: "Manage", category: "Menu", path: "/manage" },
  {
    icon: Receipt,
    text: "Transactions",
    category: "Menu",
    path: "/transactions",
  },
  { icon: Settings, text: "Settings", category: "Others", path: "/settings" },
];
