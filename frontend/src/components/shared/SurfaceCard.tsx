import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

// White rounded card used on buyer pages
export const SurfaceCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn("rounded-2xl bg-white p-6", className)}>
    {children}
  </section>
);
