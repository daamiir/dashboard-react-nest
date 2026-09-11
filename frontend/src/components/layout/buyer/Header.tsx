import Logout from "@/components/Logout";
import { ModeToggle } from "@/components/ui/mode-toggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex justify-between w-full">
        <h2 className="text-lg font-bold">Logo</h2>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Header;
