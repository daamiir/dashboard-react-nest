import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Logout from "@/components/Logout";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex justify-between w-full">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Header;
