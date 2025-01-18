export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export type ButtonProps = {
  size?: "default" | "lg" | "sm" | "icon";
};
