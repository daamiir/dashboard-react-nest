import type { LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  items: NavSubItem[];
}
