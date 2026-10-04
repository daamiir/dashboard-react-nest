import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CollapseToggle = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    aria-label={open ? "Collapse" : "Expand"}
    onClick={onToggle}
  >
    {open ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )}
  </Button>
);
