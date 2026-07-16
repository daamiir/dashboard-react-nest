import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
          url: "/dashboard/",
        },
        {
          title: "Sub Item 1",
          url: "/dashboard/sub-item-1",
        },
        {
          title: "Sub Item 2",
          url: "/dashboard/sub-item-2",
        },
      ],
    },
    {
      title: "Ecommerce",
      url: "/ecommerce",
      icon: ShoppingCart,
      isActive: false,
      items: [
        {
          title: "Products",
          url: "/ecommerce/products",
        },
        {
          title: "Orders",
          url: "/ecommerce/orders",
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
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </SidebarComponent>
  );
};

export default Sidebar;
