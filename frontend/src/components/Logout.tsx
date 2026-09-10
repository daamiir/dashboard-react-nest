import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

const Logout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    queryClient.clear();
    logout();
  };

  return (
    <Button variant="outline" size="icon" onClick={handleLogout}>
      <LogOutIcon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Log Out</span>
    </Button>
  );
};

export default Logout;
