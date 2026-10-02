import Logout from "@/components/Logout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { Link } from "react-router-dom";

const Header = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b bg-card px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex justify-between w-full">
        <h2 className="text-lg font-bold">
          <Link to="/">ElectronX</Link>
        </h2>
        <div className="flex items-center gap-2">
          {token ? (
            <Logout />
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
