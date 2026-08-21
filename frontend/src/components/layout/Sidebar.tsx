import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingCart } from "lucide-react";
import { NavMain } from "./sidebar/nav-main";
import type { NavItem } from "./sidebar/types";

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: false,
      items: [
        {
          title: "Home",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "E-commerce",
      url: "/e-commerce",
      icon: ShoppingCart,
      isActive: false,
      items: [
        {
          title: "Products",
          url: "/e-commerce/products",
        },
        {
          title: "Add Product",
          url: "/e-commerce/add-product",
        },
      ],
    },
  ],
};

const Sidebar = () => {
  return (
    <SidebarComponent>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter />
    </SidebarComponent>
  );
};

export default Sidebar;
