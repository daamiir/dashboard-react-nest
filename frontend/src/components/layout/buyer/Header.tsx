import Logout from "@/components/Logout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { SearchBar } from "@/modules/search/components/SearchBar";
import {
  selectCartCount,
  useCartStore,
} from "@/modules/cart/store/useCartStore";

const Header = () => {
  const token = useAuthStore((state) => state.token);
  const cartCount = useCartStore(selectCartCount);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b bg-card px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-lg font-bold">
          <Link to="/">ElectronX</Link>
        </h2>
        <SearchBar />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
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
