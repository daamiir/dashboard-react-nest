import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function UserMenuButton({ to }: { to: string }) {
  return (
    <Button asChild variant="ghost" size="icon" aria-label="Profile">
      <Link to={to}>
        <User className="size-5" />
      </Link>
    </Button>
  );
}
