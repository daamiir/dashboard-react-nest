import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the products. Please try again in a moment.",
  onRetry,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 py-10 text-center",
        className,
      )}
    >
      {" "}
      <p className="text-sm font-medium">{title}</p>{" "}
      <p className="text-sm text-muted-foreground">{message}</p>{" "}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          {" "}
          Try again{" "}
        </Button>
      )}{" "}
    </div>
  );
}
