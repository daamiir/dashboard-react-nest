import { ChevronRight, LogOut, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCartStore } from "@/modules/cart/store/useCartStore";

export function ProfileLayout({ profilePath }: { profilePath: string }) {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clear);

  const handleLogout = () => {
    queryClient.clear();
    clearCart();
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-4 p-4 md:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl bg-card p-2">
        <NavLink
          to={profilePath}
          end
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
              isActive && "text-primary",
            )
          }
        >
          <User className="size-5" />
          Profile
          <ChevronRight className="ml-auto size-4" />
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500"
        >
          <LogOut className="size-5" />
          Log out
        </button>
      </aside>
      <SurfaceCard>
        <Outlet />
      </SurfaceCard>
    </div>
  );
}
