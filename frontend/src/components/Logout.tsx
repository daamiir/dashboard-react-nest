import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Logout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const clearCart = useCartStore((s) => s.clear);

  const handleLogout = () => {
    queryClient.clear();
    clearCart();
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleLogout}>
      <LogOutIcon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Log Out</span>
    </Button>
  );
};

export default Logout;
