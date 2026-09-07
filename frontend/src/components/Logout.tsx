import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

const Logout = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
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
